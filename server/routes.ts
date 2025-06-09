import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertProductSchema, insertOrderSchema, insertLocationSchema, insertCompanySchema, insertStoreManagerSchema, insertStoreSchema, insertMenuSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const storage = await getStorage();
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/dashboard/revenue", async (req, res) => {
    try {
      const storage = await getStorage();
      const revenueData = await storage.getRevenueData();
      res.json(revenueData);
    } catch (error) {
      console.error("Revenue data error:", error);
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });

  app.get("/api/dashboard/activity", async (req, res) => {
    try {
      const storage = await getStorage();
      const activityData = await storage.getActivityData();
      res.json(activityData);
    } catch (error) {
      console.error("Activity data error:", error);
      res.status(500).json({ message: "Failed to fetch activity data" });
    }
  });

  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const storage = await getStorage();
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Users fetch error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("User fetch error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const storage = await getStorage();
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error("User create error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, userData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("User update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("User delete error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const storage = await getStorage();
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Products fetch error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Product fetch error:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const storage = await getStorage();
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Product create error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Product update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Product delete error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const storage = await getStorage();
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Orders fetch error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/recent", async (req, res) => {
    try {
      const storage = await getStorage();
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const orders = await storage.getRecentOrders(limit);
      res.json(orders);
    } catch (error) {
      console.error("Recent orders fetch error:", error);
      res.status(500).json({ message: "Failed to fetch recent orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Order fetch error:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const storage = await getStorage();
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      console.error("Order create error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const orderData = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(id, orderData);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Order update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteOrder(id);
      if (!deleted) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Order delete error:", error);
      res.status(500).json({ message: "Failed to delete order" });
    }
  });

  // Locations
  app.get("/api/locations", async (req, res) => {
    try {
      const storage = await getStorage();
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      console.error("Locations fetch error:", error);
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const location = await storage.getLocation(id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      console.error("Location fetch error:", error);
      res.status(500).json({ message: "Failed to fetch location" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const storage = await getStorage();
      const locationData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(locationData);
      res.status(201).json(location);
    } catch (error) {
      console.error("Location create error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create location" });
    }
  });

  app.put("/api/locations/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const locationData = insertLocationSchema.partial().parse(req.body);
      const location = await storage.updateLocation(id, locationData);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      console.error("Location update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  app.delete("/api/locations/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteLocation(id);
      if (!deleted) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Location delete error:", error);
      res.status(500).json({ message: "Failed to delete location" });
    }
  });

  // Companies routes
  app.get("/api/companies", async (req, res) => {
    try {
      const storage = await getStorage();
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Companies fetch error:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      
      const company = await storage.getCompany(id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json(company);
    } catch (error) {
      console.error("Company fetch error:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const storage = await getStorage();
      const result = insertCompanySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid company data", 
          errors: result.error.issues 
        });
      }

      const company = await storage.createCompany(result.data);
      res.status(201).json(company);
    } catch (error) {
      console.error("Company creation error:", error);
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  app.patch("/api/companies/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }

      const result = insertCompanySchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid company data", 
          errors: result.error.issues 
        });
      }

      const company = await storage.updateCompany(id, result.data);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.json(company);
    } catch (error) {
      console.error("Company update error:", error);
      res.status(500).json({ message: "Failed to update company" });
    }
  });

  app.delete("/api/companies/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }

      const deleted = await storage.deleteCompany(id);
      if (!deleted) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Company delete error:", error);
      res.status(500).json({ message: "Failed to delete company" });
    }
  });

  // Store managers routes
  app.get("/api/store-managers", async (req, res) => {
    try {
      const storage = await getStorage();
      const storeManagers = await storage.getStoreManagers();
      res.json(storeManagers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store managers" });
    }
  });

  app.post("/api/store-managers", async (req, res) => {
    try {
      const storage = await getStorage();
      const result = insertStoreManagerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid store manager data", 
          errors: result.error.issues 
        });
      }
      const storeManager = await storage.createStoreManager(result.data);
      res.status(201).json(storeManager);
    } catch (error) {
      res.status(500).json({ message: "Failed to create store manager" });
    }
  });

  app.patch("/api/store-managers/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const result = insertStoreManagerSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid store manager data", 
          errors: result.error.issues 
        });
      }
      const storeManager = await storage.updateStoreManager(id, result.data);
      if (!storeManager) {
        return res.status(404).json({ message: "Store manager not found" });
      }
      res.json(storeManager);
    } catch (error) {
      res.status(500).json({ message: "Failed to update store manager" });
    }
  });

  app.delete("/api/store-managers/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteStoreManager(id);
      if (!deleted) {
        return res.status(404).json({ message: "Store manager not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete store manager" });
    }
  });

  // Stores routes
  app.get("/api/stores", async (req, res) => {
    try {
      const storage = await getStorage();
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  app.post("/api/stores", async (req, res) => {
    try {
      const storage = await getStorage();
      const result = insertStoreSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid store data", 
          errors: result.error.issues 
        });
      }
      const store = await storage.createStore(result.data);
      res.status(201).json(store);
    } catch (error) {
      res.status(500).json({ message: "Failed to create store" });
    }
  });

  app.patch("/api/stores/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const result = insertStoreSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid store data", 
          errors: result.error.issues 
        });
      }
      const store = await storage.updateStore(id, result.data);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      res.status(500).json({ message: "Failed to update store" });
    }
  });

  app.delete("/api/stores/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteStore(id);
      if (!deleted) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete store" });
    }
  });

  // Menus routes
  app.get("/api/menus", async (req, res) => {
    try {
      const storage = await getStorage();
      const menus = await storage.getMenus();
      res.json(menus);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menus" });
    }
  });

  app.post("/api/menus", async (req, res) => {
    try {
      const storage = await getStorage();
      const result = insertMenuSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid menu data", 
          errors: result.error.issues 
        });
      }
      const menu = await storage.createMenu(result.data);
      res.status(201).json(menu);
    } catch (error) {
      res.status(500).json({ message: "Failed to create menu" });
    }
  });

  app.patch("/api/menus/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const result = insertMenuSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid menu data", 
          errors: result.error.issues 
        });
      }
      const menu = await storage.updateMenu(id, result.data);
      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }
      res.json(menu);
    } catch (error) {
      res.status(500).json({ message: "Failed to update menu" });
    }
  });

  app.delete("/api/menus/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMenu(id);
      if (!deleted) {
        return res.status(404).json({ message: "Menu not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete menu" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}