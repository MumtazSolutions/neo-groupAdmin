import { MongoClient, Db, Collection } from "mongodb";
import type { 
  User, InsertUser,
  Product, InsertProduct,
  Order, InsertOrder, OrderWithUserAndProduct,
  DashboardStats, InsertDashboardStats,
  RevenueData, InsertRevenueData,
  ActivityData, InsertActivityData,
  Location, InsertLocation,
  Company, InsertCompany,
  Store, InsertStore,
  StoreManager, InsertStoreManager,
  Menu, InsertMenu
} from "@shared/schema";
import type { IStorage } from "./storage";

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (!client) {
    try {
      // Use correct password format
      const password = "mumtazsolutions2019";
      const connectionString = `mongodb+srv://mumtazsolutionsali:${password}@cluster0.zlkielc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
      
      console.log("Connecting to MongoDB Atlas with direct credentials...");
      
      client = new MongoClient(connectionString, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4
      });
      
      await client.connect();
      
      // Test the connection
      const admin = client.db("admin");
      await admin.command({ ping: 1 });
      
      db = client.db("neogroup");
      console.log("Successfully connected to MongoDB Atlas - neogroup database");
      
      // Initialize collections - remove problematic unique index on id field
      await db.collection("locations").createIndex({ locationName: 1 });
      
      return db;
    } catch (error) {
      console.error("MongoDB Atlas connection failed:", error);
      throw error;
    }
  }
  return db;
}

export class MongoStorage implements IStorage {
  private db: Db;
  private usersCollection: Collection<User>;
  private productsCollection: Collection<Product>;
  private ordersCollection: Collection<Order>;
  private locationsCollection: Collection<Location>;
  private companiesCollection: Collection<Company>;
  private storesCollection: Collection<Store>;
  private storeManagersCollection: Collection<StoreManager>;
  private menusCollection: Collection<Menu>;
  private dashboardStatsCollection: Collection<DashboardStats>;
  private revenueDataCollection: Collection<RevenueData>;
  private activityDataCollection: Collection<ActivityData>;

  constructor(database: Db) {
    if (!database) {
      throw new Error("Database instance is required for MongoStorage");
    }
    this.db = database;
    this.usersCollection = database.collection("users");
    this.productsCollection = database.collection("products");
    this.ordersCollection = database.collection("orders");
    this.locationsCollection = database.collection("locations");
    this.companiesCollection = database.collection("companies");
    this.storesCollection = database.collection("stores");
    this.storeManagersCollection = database.collection("store_managers");
    this.menusCollection = database.collection("menus");
    this.dashboardStatsCollection = database.collection("dashboard_stats");
    this.revenueDataCollection = database.collection("revenue_data");
    this.activityDataCollection = database.collection("activity_data");
  }

  // Users
  async getUsers(): Promise<User[]> {
    const users = await this.usersCollection.find({}).toArray();
    return users.map(user => ({ 
      ...user, 
      id: user.id || parseInt(user._id.toString(), 16) % 1000000,
      _id: undefined 
    } as any));
  }

  async getUser(id: number): Promise<User | undefined> {
    const user = await this.usersCollection.findOne({ id: id });
    return user ? { 
      ...user, 
      id: user.id || parseInt(user._id.toString(), 16) % 1000000,
      _id: undefined 
    } as any : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersCollection.findOne({ email });
    return user ? { ...user, id: user._id as any } : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.usersCollection.insertOne({
      ...insertUser,
      avatar: insertUser.avatar || null,
      role: insertUser.role || "user",
      isActive: insertUser.isActive ?? true,
      createdAt: new Date()
    } as any);
    
    const user = await this.usersCollection.findOne({ _id: result.insertedId });
    return { ...user!, id: user!._id as any };
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    await this.usersCollection.updateOne({ _id: id as any }, { $set: updateData });
    const user = await this.usersCollection.findOne({ _id: id as any });
    return user ? { ...user, id: user._id as any } : undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.usersCollection.deleteOne({ _id: id as any });
    return result.deletedCount > 0;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const products = await this.productsCollection.find({}).toArray();
    return products.map(product => ({ ...product, id: product._id as any }));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const product = await this.productsCollection.findOne({ _id: id as any });
    return product ? { ...product, id: product._id as any } : undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await this.productsCollection.insertOne({
      ...insertProduct,
      description: insertProduct.description || null,
      category: insertProduct.category || null,
      stock: insertProduct.stock || 0,
      isActive: insertProduct.isActive ?? true,
      createdAt: new Date()
    } as any);
    
    const product = await this.productsCollection.findOne({ _id: result.insertedId });
    return { ...product!, id: product!._id as any };
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    await this.productsCollection.updateOne({ _id: id as any }, { $set: updateData });
    const product = await this.productsCollection.findOne({ _id: id as any });
    return product ? { ...product, id: product._id as any } : undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.productsCollection.deleteOne({ _id: id as any });
    return result.deletedCount > 0;
  }

  // Orders
  async getOrders(): Promise<OrderWithUserAndProduct[]> {
    const orders = await this.ordersCollection.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $unwind: "$product"
      }
    ]).toArray();

    return orders.map(order => ({
      ...order,
      id: order._id as any,
      user: { ...order.user, id: order.user._id as any },
      product: { ...order.product, id: order.product._id as any }
    })) as OrderWithUserAndProduct[];
  }

  async getOrder(id: number): Promise<OrderWithUserAndProduct | undefined> {
    const orders = await this.ordersCollection.aggregate([
      { $match: { _id: id as any } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $unwind: "$product"
      }
    ]).toArray();

    if (orders.length === 0) return undefined;
    
    const order = orders[0];
    return {
      ...order,
      id: order._id as any,
      user: { ...order.user, id: order.user._id as any },
      product: { ...order.product, id: order.product._id as any }
    } as OrderWithUserAndProduct;
  }

  async getRecentOrders(limit: number = 10): Promise<OrderWithUserAndProduct[]> {
    const orders = await this.ordersCollection.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $unwind: "$product"
      }
    ]).toArray();

    return orders.map(order => ({
      ...order,
      id: order._id as any,
      user: { ...order.user, id: order.user._id as any },
      product: { ...order.product, id: order.product._id as any }
    })) as OrderWithUserAndProduct[];
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const result = await this.ordersCollection.insertOne({
      ...insertOrder,
      status: insertOrder.status || "pending",
      createdAt: new Date()
    } as any);
    
    const order = await this.ordersCollection.findOne({ _id: result.insertedId });
    return { ...order!, id: order!._id as any };
  }

  async updateOrder(id: number, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    await this.ordersCollection.updateOne({ _id: id as any }, { $set: updateData });
    const order = await this.ordersCollection.findOne({ _id: id as any });
    return order ? { ...order, id: order._id as any } : undefined;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const result = await this.ordersCollection.deleteOne({ _id: id as any });
    return result.deletedCount > 0;
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    let stats = await this.dashboardStatsCollection.findOne({});
    if (!stats) {
      // Create default dashboard stats if none exist
      const defaultStats = {
        totalRevenue: "47281.00",
        activeUsers: 2847,
        totalOrders: 1293,
        conversionRate: "3.24",
        revenueChange: "12.3",
        usersChange: "8.7",
        ordersChange: "-2.1",
        conversionChange: "0.8",
        updatedAt: new Date()
      };
      const result = await this.dashboardStatsCollection.insertOne(defaultStats as any);
      stats = await this.dashboardStatsCollection.findOne({ _id: result.insertedId });
    }
    return { ...stats!, id: stats!._id as any };
  }

  async updateDashboardStats(updateStats: InsertDashboardStats): Promise<DashboardStats> {
    await this.dashboardStatsCollection.updateOne(
      {},
      { $set: { ...updateStats, updatedAt: new Date() } },
      { upsert: true }
    );
    const stats = await this.dashboardStatsCollection.findOne({});
    return { ...stats!, id: stats!._id as any };
  }

  async getRevenueData(): Promise<RevenueData[]> {
    let revenueData = await this.revenueDataCollection.find({}).toArray();
    if (revenueData.length === 0) {
      // Create default revenue data if none exist
      const defaultData = [
        { date: "Mon", revenue: "12000.00" },
        { date: "Tue", revenue: "19000.00" },
        { date: "Wed", revenue: "15000.00" },
        { date: "Thu", revenue: "17000.00" },
        { date: "Fri", revenue: "23000.00" },
        { date: "Sat", revenue: "18000.00" },
        { date: "Sun", revenue: "21000.00" }
      ];
      await this.revenueDataCollection.insertMany(defaultData as any);
      revenueData = await this.revenueDataCollection.find({}).toArray();
    }
    return revenueData.map(data => ({ ...data, id: data._id as any }));
  }

  async getActivityData(): Promise<ActivityData> {
    let activityData = await this.activityDataCollection.findOne({});
    if (!activityData) {
      // Create default activity data if none exist
      const defaultData = {
        activeUsers: 2847,
        inactiveUsers: 1253
      };
      const result = await this.activityDataCollection.insertOne(defaultData as any);
      activityData = await this.activityDataCollection.findOne({ _id: result.insertedId });
    }
    return { ...activityData!, id: activityData!._id as any };
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    const locations = await this.locationsCollection.find({}).toArray();
    return locations.map(location => ({ 
      ...location, 
      id: typeof location.id === 'number' ? location.id : parseInt(location._id.toString(), 16) % 1000000,
      _id: undefined 
    } as any));
  }

  async getLocation(id: number): Promise<Location | undefined> {
    const location = await this.locationsCollection.findOne({ id: id });
    return location ? { ...location, id: location.id } : undefined;
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    // Get the highest ID to generate next sequential ID
    const maxIdDoc = await this.locationsCollection.find({}).sort({ id: -1 }).limit(1).toArray();
    let id = 1;
    
    if (maxIdDoc.length > 0 && typeof maxIdDoc[0].id === 'number' && !isNaN(maxIdDoc[0].id)) {
      id = maxIdDoc[0].id + 1;
    } else {
      // If no valid ID found, count existing documents and start from there
      const count = await this.locationsCollection.countDocuments();
      id = count + 1;
    }
    
    const location: Location = {
      ...insertLocation,
      id,
      description: insertLocation.description || null,
      createdAt: new Date()
    } as any;
    
    await this.locationsCollection.insertOne(location as any);
    return location;
  }

  async updateLocation(id: number, updateData: Partial<InsertLocation>): Promise<Location | undefined> {
    await this.locationsCollection.updateOne({ id: id }, { $set: updateData });
    const location = await this.locationsCollection.findOne({ id: id });
    return location ? { ...location, id: location.id } : undefined;
  }

  async deleteLocation(id: number): Promise<boolean> {
    const result = await this.locationsCollection.deleteOne({ id: id });
    return result.deletedCount > 0;
  }

  // Companies
  async getCompanies(): Promise<Company[]> {
    const companies = await this.companiesCollection.find({}).toArray();
    return companies.map(company => ({ 
      ...company, 
      id: typeof company.id === 'number' ? company.id : parseInt(company._id.toString(), 16) % 1000000,
      _id: undefined 
    } as any));
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const company = await this.companiesCollection.findOne({ id: id });
    return company ? { ...company, id: company.id } : undefined;
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const maxIdDoc = await this.companiesCollection.find({}).sort({ id: -1 }).limit(1).toArray();
    let id = 1;
    
    if (maxIdDoc.length > 0 && typeof maxIdDoc[0].id === 'number' && !isNaN(maxIdDoc[0].id)) {
      id = maxIdDoc[0].id + 1;
    } else {
      const count = await this.companiesCollection.countDocuments();
      id = count + 1;
    }
    
    const company: Company = {
      ...insertCompany,
      id,
      locations: insertCompany.locations || null,
      rollover: insertCompany.rollover || false,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any;
    
    await this.companiesCollection.insertOne(company as any);
    return company;
  }

  async updateCompany(id: number, updateData: Partial<InsertCompany>): Promise<Company | undefined> {
    await this.companiesCollection.updateOne({ id: id }, { $set: { ...updateData, updatedAt: new Date() } });
    const company = await this.companiesCollection.findOne({ id: id });
    return company ? { ...company, id: company.id } : undefined;
  }

  async deleteCompany(id: number): Promise<boolean> {
    const result = await this.companiesCollection.deleteOne({ id: id });
    return result.deletedCount > 0;
  }

  // Stores
  async getStores(): Promise<Store[]> {
    const stores = await this.storesCollection.find({}).toArray();
    return stores.map(store => ({ 
      ...store, 
      id: typeof store.id === 'number' ? store.id : parseInt(store._id.toString(), 16) % 1000000,
      _id: undefined 
    } as any));
  }

  async getStore(id: number): Promise<Store | undefined> {
    const store = await this.storesCollection.findOne({ id: id });
    return store ? { ...store, id: store.id } : undefined;
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const maxIdDoc = await this.storesCollection.find({}).sort({ id: -1 }).limit(1).toArray();
    let id = 1;
    
    if (maxIdDoc.length > 0 && typeof maxIdDoc[0].id === 'number' && !isNaN(maxIdDoc[0].id)) {
      id = maxIdDoc[0].id + 1;
    } else {
      const count = await this.storesCollection.countDocuments();
      id = count + 1;
    }
    
    const store: Store = {
      ...insertStore,
      id,
      locationId: insertStore.locationId || null,
      managerId: insertStore.managerId || null,
      phone: insertStore.phone || null,
      email: insertStore.email || null,
      status: insertStore.status || "active",
      description: insertStore.description || null,
      createdAt: new Date()
    } as any;
    
    await this.storesCollection.insertOne(store as any);
    return store;
  }

  async updateStore(id: number, updateData: Partial<InsertStore>): Promise<Store | undefined> {
    await this.storesCollection.updateOne({ id: id }, { $set: updateData });
    const store = await this.storesCollection.findOne({ id: id });
    return store ? { ...store, id: store.id } : undefined;
  }

  async deleteStore(id: number): Promise<boolean> {
    const result = await this.storesCollection.deleteOne({ id: id });
    return result.deletedCount > 0;
  }

  // Store Managers
  async getStoreManagers(): Promise<StoreManager[]> {
    const storeManagers = await this.storeManagersCollection.find({}).toArray();
    return storeManagers.map(storeManager => ({ 
      ...storeManager, 
      id: typeof storeManager.id === 'number' ? storeManager.id : parseInt(storeManager._id.toString(), 16) % 1000000,
      _id: undefined 
    } as any));
  }

  async getStoreManager(id: number): Promise<StoreManager | undefined> {
    const storeManager = await this.storeManagersCollection.findOne({ id: id });
    return storeManager ? { ...storeManager, id: storeManager.id } : undefined;
  }

  async createStoreManager(insertStoreManager: InsertStoreManager): Promise<StoreManager> {
    const maxIdDoc = await this.storeManagersCollection.find({}).sort({ id: -1 }).limit(1).toArray();
    let id = 1;
    
    if (maxIdDoc.length > 0 && typeof maxIdDoc[0].id === 'number' && !isNaN(maxIdDoc[0].id)) {
      id = maxIdDoc[0].id + 1;
    } else {
      const count = await this.storeManagersCollection.countDocuments();
      id = count + 1;
    }
    
    const storeManager: StoreManager = {
      ...insertStoreManager,
      id,
      role: insertStoreManager.role || "manager",
      permissions: insertStoreManager.permissions || null,
      endDate: insertStoreManager.endDate || null,
      isActive: insertStoreManager.isActive ?? true,
      salary: insertStoreManager.salary || null,
      currency: insertStoreManager.currency || null,
      contactNumber: insertStoreManager.contactNumber || null,
      emergencyContact: insertStoreManager.emergencyContact || null,
      notes: insertStoreManager.notes || null,
      createdAt: new Date()
    } as any;
    
    await this.storeManagersCollection.insertOne(storeManager as any);
    return storeManager;
  }

  async updateStoreManager(id: number, updateData: Partial<InsertStoreManager>): Promise<StoreManager | undefined> {
    await this.storeManagersCollection.updateOne({ id: id }, { $set: updateData });
    const storeManager = await this.storeManagersCollection.findOne({ id: id });
    return storeManager ? { ...storeManager, id: storeManager.id } : undefined;
  }

  async deleteStoreManager(id: number): Promise<boolean> {
    const result = await this.storeManagersCollection.deleteOne({ id: id });
    return result.deletedCount > 0;
  }

  // Menus
  async getMenus(): Promise<Menu[]> {
    const menus = await this.menusCollection.find({}).toArray();
    return menus.map(menu => ({ 
      ...menu, 
      id: typeof menu.id === 'number' ? menu.id : parseInt(menu._id.toString(), 16) % 1000000,
      _id: undefined 
    } as any));
  }

  async getMenu(id: number): Promise<Menu | undefined> {
    const menu = await this.menusCollection.findOne({ id: id });
    return menu ? { ...menu, id: menu.id } : undefined;
  }

  async createMenu(insertMenu: InsertMenu): Promise<Menu> {
    const maxIdDoc = await this.menusCollection.find({}).sort({ id: -1 }).limit(1).toArray();
    let id = 1;
    
    if (maxIdDoc.length > 0 && typeof maxIdDoc[0].id === 'number' && !isNaN(maxIdDoc[0].id)) {
      id = maxIdDoc[0].id + 1;
    } else {
      const count = await this.menusCollection.countDocuments();
      id = count + 1;
    }
    
    const menu: Menu = {
      ...insertMenu,
      id,
      description: insertMenu.description || null,
      isAvailable: insertMenu.isAvailable ?? true,
      ingredients: insertMenu.ingredients || null,
      allergens: insertMenu.allergens || null,
      nutritionInfo: insertMenu.nutritionInfo || null,
      imageUrl: insertMenu.imageUrl || null,
      preparationTime: insertMenu.preparationTime || null,
      createdAt: new Date()
    } as any;
    
    await this.menusCollection.insertOne(menu as any);
    return menu;
  }

  async updateMenu(id: number, updateData: Partial<InsertMenu>): Promise<Menu | undefined> {
    await this.menusCollection.updateOne({ id: id }, { $set: updateData });
    const menu = await this.menusCollection.findOne({ id: id });
    return menu ? { ...menu, id: menu.id } : undefined;
  }

  async deleteMenu(id: number): Promise<boolean> {
    const result = await this.menusCollection.deleteOne({ id: id });
    return result.deletedCount > 0;
  }
}