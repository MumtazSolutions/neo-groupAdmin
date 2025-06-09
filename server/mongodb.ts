import { MongoClient, Db, Collection } from "mongodb";
import type { 
  User, InsertUser,
  Product, InsertProduct,
  Order, InsertOrder, OrderWithUserAndProduct,
  DashboardStats, InsertDashboardStats,
  RevenueData, InsertRevenueData,
  ActivityData, InsertActivityData,
  Location, InsertLocation
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
}