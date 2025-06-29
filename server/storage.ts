import { 
  users, products, orders, dashboardStats, revenueData, activityData, locations, companies, stores, storeManagers, menus,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Order, type InsertOrder, type OrderWithUserAndProduct,
  type DashboardStats, type InsertDashboardStats,
  type RevenueData, type InsertRevenueData,
  type ActivityData, type InsertActivityData,
  type Location, type InsertLocation,
  type Company, type InsertCompany,
  type Store, type InsertStore,
  type StoreManager, type InsertStoreManager,
  type Menu, type InsertMenu
} from "@shared/schema";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Orders
  getOrders(): Promise<OrderWithUserAndProduct[]>;
  getOrder(id: number): Promise<OrderWithUserAndProduct | undefined>;
  getRecentOrders(limit?: number): Promise<OrderWithUserAndProduct[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;

  // Dashboard
  getDashboardStats(): Promise<DashboardStats>;
  updateDashboardStats(stats: InsertDashboardStats): Promise<DashboardStats>;
  getRevenueData(): Promise<RevenueData[]>;
  getActivityData(): Promise<ActivityData>;

  // Locations
  getLocations(): Promise<Location[]>;
  getLocation(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: number): Promise<boolean>;

  // Companies
  getCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined>;
  deleteCompany(id: number): Promise<boolean>;

  // Stores
  getStores(): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: number, store: Partial<InsertStore>): Promise<Store | undefined>;
  deleteStore(id: number): Promise<boolean>;

  // Store Managers
  getStoreManagers(): Promise<StoreManager[]>;
  getStoreManager(id: number): Promise<StoreManager | undefined>;
  createStoreManager(storeManager: InsertStoreManager): Promise<StoreManager>;
  updateStoreManager(id: number, storeManager: Partial<InsertStoreManager>): Promise<StoreManager | undefined>;
  deleteStoreManager(id: number): Promise<boolean>;

  // Menus
  getMenus(): Promise<Menu[]>;
  getMenu(id: number): Promise<Menu | undefined>;
  createMenu(menu: InsertMenu): Promise<Menu>;
  updateMenu(id: number, menu: Partial<InsertMenu>): Promise<Menu | undefined>;
  deleteMenu(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private locations: Map<number, Location>;
  private companies: Map<number, Company>;
  private stores: Map<number, Store>;
  private storeManagers: Map<number, StoreManager>;
  private menus: Map<number, Menu>;
  private dashboardStats!: DashboardStats;
  private revenueData!: RevenueData[];
  private activityData!: ActivityData;
  private currentUserId: number;
  private currentProductId: number;
  private currentOrderId: number;
  private currentLocationId: number;
  private currentCompanyId: number;
  private currentStoreId: number;
  private currentStoreManagerId: number;
  private currentMenuId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.locations = new Map();
    this.companies = new Map();
    this.stores = new Map();
    this.storeManagers = new Map();
    this.menus = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentLocationId = 1;
    this.currentCompanyId = 1;
    this.currentStoreId = 1;
    this.currentStoreManagerId = 1;
    this.currentMenuId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample users
    const sampleUsers: User[] = [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        avatar: "https://pixabay.com/get/g7bccd70632ccc3f240863f800c4f0e59f0328803f4c70fd7e0a52ee4e0ddaef39d34c25dd4c09a26fb8afe727eec0dd61e709cf1104e4cb2bfd527b79003f6db_1280.jpg",
        role: "customer",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Michael Chen",
        email: "michael@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=32&h=32",
        role: "customer",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Emily Davis",
        email: "emily@example.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=32&h=32",
        role: "customer",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 4,
        name: "John Doe",
        email: "admin@neogroup.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=40&h=40",
        role: "admin",
        isActive: true,
        createdAt: new Date(),
      }
    ];

    sampleUsers.forEach(user => {
      this.users.set(user.id, user);
      if (user.id >= this.currentUserId) this.currentUserId = user.id + 1;
    });

    // Sample products
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Premium Plan",
        description: "Full access to all premium features",
        price: "99.00",
        category: "subscription",
        stock: 999,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Basic Plan",
        description: "Essential features for getting started",
        price: "29.00",
        category: "subscription",
        stock: 999,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Enterprise Plan",
        description: "Advanced features for large organizations",
        price: "199.00",
        category: "subscription",
        stock: 999,
        isActive: true,
        createdAt: new Date(),
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
      if (product.id >= this.currentProductId) this.currentProductId = product.id + 1;
    });

    // Sample orders
    const sampleOrders: Order[] = [
      {
        id: 1,
        orderNumber: "#12847",
        userId: 1,
        productId: 1,
        amount: "99.00",
        status: "completed",
        createdAt: new Date("2024-10-12"),
      },
      {
        id: 2,
        orderNumber: "#12846",
        userId: 2,
        productId: 2,
        amount: "29.00",
        status: "pending",
        createdAt: new Date("2024-10-12"),
      },
      {
        id: 3,
        orderNumber: "#12845",
        userId: 3,
        productId: 3,
        amount: "199.00",
        status: "failed",
        createdAt: new Date("2024-10-11"),
      }
    ];

    sampleOrders.forEach(order => {
      this.orders.set(order.id, order);
      if (order.id >= this.currentOrderId) this.currentOrderId = order.id + 1;
    });

    // Dashboard stats
    this.dashboardStats = {
      id: 1,
      totalRevenue: "47281.00",
      activeUsers: 2847,
      totalOrders: 1293,
      conversionRate: "3.24",
      revenueChange: "12.3",
      usersChange: "8.7",
      ordersChange: "-2.1",
      conversionChange: "0.8",
      updatedAt: new Date(),
    };

    // Revenue data
    this.revenueData = [
      { id: 1, date: "Mon", revenue: "12000.00" },
      { id: 2, date: "Tue", revenue: "19000.00" },
      { id: 3, date: "Wed", revenue: "15000.00" },
      { id: 4, date: "Thu", revenue: "17000.00" },
      { id: 5, date: "Fri", revenue: "23000.00" },
      { id: 6, date: "Sat", revenue: "18000.00" },
      { id: 7, date: "Sun", revenue: "21000.00" },
    ];

    // Activity data
    this.activityData = {
      id: 1,
      activeUsers: 2847,
      inactiveUsers: 1253,
    };

    // Sample locations
    const sampleLocations: Location[] = [
      {
        id: 1,
        locationName: "Headquarters",
        locationType: "Office",
        address: "123 Business Plaza, Suite 100",
        city: "New York",
        stateProvince: "NY",
        zipPostalCode: "10001",
        country: "United States of America",
        currency: "USD",
        description: "Main corporate headquarters with executive offices",
        createdAt: new Date(),
      },
      {
        id: 2,
        locationName: "West Coast Distribution Center",
        locationType: "Warehouse",
        address: "456 Industrial Way",
        city: "Los Angeles",
        stateProvince: "CA",
        zipPostalCode: "90210",
        country: "United States of America",
        currency: "USD",
        description: "Primary distribution facility for western region",
        createdAt: new Date(),
      },
      {
        id: 3,
        locationName: "Toronto Branch Office",
        locationType: "Office",
        address: "789 Bay Street",
        city: "Toronto",
        stateProvince: "ON",
        zipPostalCode: "M5H 2Y4",
        country: "Canada",
        currency: "CAD",
        description: "Regional office serving Canadian markets",
        createdAt: new Date(),
      }
    ];

    sampleLocations.forEach(location => {
      this.locations.set(location.id, location);
      if (location.id >= this.currentLocationId) this.currentLocationId = location.id + 1;
    });
  }

  // Users
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      name: insertUser.name,
      email: insertUser.email,
      avatar: insertUser.avatar || null,
      role: insertUser.role || "user",
      isActive: insertUser.isActive ?? true,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      id,
      name: insertProduct.name,
      description: insertProduct.description || null,
      price: insertProduct.price,
      category: insertProduct.category || null,
      stock: insertProduct.stock || 0,
      isActive: insertProduct.isActive ?? true,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updateData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Orders
  async getOrders(): Promise<OrderWithUserAndProduct[]> {
    const orders = Array.from(this.orders.values());
    return orders.map(order => ({
      ...order,
      user: this.users.get(order.userId)!,
      product: this.products.get(order.productId)!,
    }));
  }

  async getOrder(id: number): Promise<OrderWithUserAndProduct | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    return {
      ...order,
      user: this.users.get(order.userId)!,
      product: this.products.get(order.productId)!,
    };
  }

  async getRecentOrders(limit: number = 10): Promise<OrderWithUserAndProduct[]> {
    const orders = await this.getOrders();
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      id,
      orderNumber: insertOrder.orderNumber,
      userId: insertOrder.userId,
      productId: insertOrder.productId,
      amount: insertOrder.amount,
      status: insertOrder.status || "pending",
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, ...updateData };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return this.dashboardStats;
  }

  async updateDashboardStats(stats: InsertDashboardStats): Promise<DashboardStats> {
    this.dashboardStats = {
      ...this.dashboardStats,
      ...stats,
      updatedAt: new Date(),
    };
    return this.dashboardStats;
  }

  async getRevenueData(): Promise<RevenueData[]> {
    return this.revenueData;
  }

  async getActivityData(): Promise<ActivityData> {
    return this.activityData;
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocation(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = this.currentLocationId++;
    const location: Location = {
      id,
      locationName: insertLocation.locationName,
      locationType: insertLocation.locationType,
      address: insertLocation.address,
      city: insertLocation.city,
      stateProvince: insertLocation.stateProvince,
      zipPostalCode: insertLocation.zipPostalCode,
      country: insertLocation.country,
      currency: insertLocation.currency,
      description: insertLocation.description || null,
      createdAt: new Date(),
    };
    this.locations.set(id, location);
    return location;
  }

  async updateLocation(id: number, updateData: Partial<InsertLocation>): Promise<Location | undefined> {
    const location = this.locations.get(id);
    if (!location) return undefined;

    const updatedLocation = { ...location, ...updateData };
    this.locations.set(id, updatedLocation);
    return updatedLocation;
  }

  async deleteLocation(id: number): Promise<boolean> {
    return this.locations.delete(id);
  }

  // Companies
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.currentCompanyId++;
    const company: Company = {
      id,
      company: insertCompany.company,
      email: insertCompany.email,
      topupFrequency: insertCompany.topupFrequency,
      amountPerEmployee: insertCompany.amountPerEmployee,
      locations: insertCompany.locations || null,
      rollover: insertCompany.rollover || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.companies.set(id, company);
    return company;
  }

  async updateCompany(id: number, updateData: Partial<InsertCompany>): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (!company) return undefined;

    const updatedCompany = { 
      ...company, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  async deleteCompany(id: number): Promise<boolean> {
    return this.companies.delete(id);
  }

  // Stores
  async getStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }

  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const id = this.currentStoreId++;
    const store: Store = {
      id,
      storeName: insertStore.storeName,
      storeCode: insertStore.storeCode,
      locationId: insertStore.locationId || null,
      managerId: insertStore.managerId || null,
      address: insertStore.address,
      city: insertStore.city,
      stateProvince: insertStore.stateProvince,
      zipPostalCode: insertStore.zipPostalCode,
      country: insertStore.country,
      currency: insertStore.currency,
      phone: insertStore.phone || null,
      email: insertStore.email || null,
      status: insertStore.status || "active",
      description: insertStore.description || null,
      createdAt: new Date(),
    };
    this.stores.set(id, store);
    return store;
  }

  async updateStore(id: number, updateData: Partial<InsertStore>): Promise<Store | undefined> {
    const store = this.stores.get(id);
    if (!store) return undefined;

    const updatedStore = { ...store, ...updateData };
    this.stores.set(id, updatedStore);
    return updatedStore;
  }

  async deleteStore(id: number): Promise<boolean> {
    return this.stores.delete(id);
  }

  // Store Managers
  async getStoreManagers(): Promise<StoreManager[]> {
    return Array.from(this.storeManagers.values());
  }

  async getStoreManager(id: number): Promise<StoreManager | undefined> {
    return this.storeManagers.get(id);
  }

  async createStoreManager(insertStoreManager: InsertStoreManager): Promise<StoreManager> {
    const id = this.currentStoreManagerId++;
    const storeManager: StoreManager = {
      id,
      userId: insertStoreManager.userId,
      storeId: insertStoreManager.storeId,
      role: insertStoreManager.role || "manager",
      permissions: insertStoreManager.permissions || null,
      startDate: insertStoreManager.startDate,
      endDate: insertStoreManager.endDate || null,
      isActive: insertStoreManager.isActive ?? true,
      salary: insertStoreManager.salary || null,
      currency: insertStoreManager.currency || null,
      contactNumber: insertStoreManager.contactNumber || null,
      emergencyContact: insertStoreManager.emergencyContact || null,
      notes: insertStoreManager.notes || null,
      createdAt: new Date(),
    };
    this.storeManagers.set(id, storeManager);
    return storeManager;
  }

  async updateStoreManager(id: number, updateData: Partial<InsertStoreManager>): Promise<StoreManager | undefined> {
    const storeManager = this.storeManagers.get(id);
    if (!storeManager) return undefined;

    const updatedStoreManager = { ...storeManager, ...updateData };
    this.storeManagers.set(id, updatedStoreManager);
    return updatedStoreManager;
  }

  async deleteStoreManager(id: number): Promise<boolean> {
    return this.storeManagers.delete(id);
  }

  // Menus
  async getMenus(): Promise<Menu[]> {
    return Array.from(this.menus.values());
  }

  async getMenu(id: number): Promise<Menu | undefined> {
    return this.menus.get(id);
  }

  async createMenu(insertMenu: InsertMenu): Promise<Menu> {
    const id = this.currentMenuId++;
    const menu: Menu = {
      id,
      menuName: insertMenu.menuName,
      storeId: insertMenu.storeId,
      category: insertMenu.category,
      itemName: insertMenu.itemName,
      description: insertMenu.description || null,
      price: insertMenu.price,
      currency: insertMenu.currency,
      isAvailable: insertMenu.isAvailable ?? true,
      ingredients: insertMenu.ingredients || null,
      allergens: insertMenu.allergens || null,
      nutritionInfo: insertMenu.nutritionInfo || null,
      imageUrl: insertMenu.imageUrl || null,
      preparationTime: insertMenu.preparationTime || null,
      createdAt: new Date(),
    };
    this.menus.set(id, menu);
    return menu;
  }

  async updateMenu(id: number, updateData: Partial<InsertMenu>): Promise<Menu | undefined> {
    const menu = this.menus.get(id);
    if (!menu) return undefined;

    const updatedMenu = { ...menu, ...updateData };
    this.menus.set(id, updatedMenu);
    return updatedMenu;
  }

  async deleteMenu(id: number): Promise<boolean> {
    return this.menus.delete(id);
  }
}

import { connectToDatabase, MongoStorage } from "./mongodb";

let storage: IStorage | null = null;
let isConnecting = false;

export async function getStorage(): Promise<IStorage> {
  // If storage already exists, return it
  if (storage) return storage;
  
  // If already connecting, wait for it to complete
  if (isConnecting) {
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return storage!;
  }

  isConnecting = true;
  
  try {
    console.log("Storage: Attempting to connect to MongoDB...");
    const db = await connectToDatabase();
    
    if (!db) {
      throw new Error("Failed to get database instance");
    }
    
    console.log("Storage: MongoDB connected successfully, creating MongoDB storage");
    const mongoStorage = new MongoStorage(db);
    
    // Test the storage by trying to get products
    try {
      await mongoStorage.getProducts();
      console.log("Storage: MongoDB storage test successful - using MongoDB storage");
      storage = mongoStorage;
    } catch (testError) {
      console.error("Storage: MongoDB storage test failed:", testError);
      throw testError;
    }
    
  } catch (error) {
    console.error("Storage: MongoDB connection failed, falling back to memory storage:", error.message);
    console.warn("Storage: WARNING - Using memory storage, data will not persist between server restarts!");
    storage = new MemStorage();
  } finally {
    isConnecting = false;
  }

  return storage;
}

// Keep MemStorage as fallback
export const memStorage = new MemStorage();