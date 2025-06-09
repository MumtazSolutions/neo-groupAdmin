import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  avatar: text("avatar"),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dashboardStats = pgTable("dashboard_stats", {
  id: serial("id").primaryKey(),
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).notNull(),
  activeUsers: integer("active_users").notNull(),
  totalOrders: integer("total_orders").notNull(),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).notNull(),
  revenueChange: decimal("revenue_change", { precision: 5, scale: 2 }),
  usersChange: decimal("users_change", { precision: 5, scale: 2 }),
  ordersChange: decimal("orders_change", { precision: 5, scale: 2 }),
  conversionChange: decimal("conversion_change", { precision: 5, scale: 2 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const revenueData = pgTable("revenue_data", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 20 }).notNull(),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).notNull(),
});

export const activityData = pgTable("activity_data", {
  id: serial("id").primaryKey(),
  activeUsers: integer("active_users").notNull(),
  inactiveUsers: integer("inactive_users").notNull(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  locationName: varchar("location_name", { length: 255 }).notNull(),
  locationType: varchar("location_type", { length: 100 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  stateProvince: varchar("state_province", { length: 100 }).notNull(),
  zipPostalCode: varchar("zip_postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  storeName: varchar("store_name", { length: 255 }).notNull(),
  storeCode: varchar("store_code", { length: 50 }).notNull().unique(),
  locationId: integer("location_id").references(() => locations.id),
  managerId: integer("manager_id").references(() => users.id),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  stateProvince: varchar("state_province", { length: 100 }).notNull(),
  zipPostalCode: varchar("zip_postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const menus = pgTable("menus", {
  id: serial("id").primaryKey(),
  menuName: varchar("menu_name", { length: 255 }).notNull(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  itemName: varchar("item_name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  ingredients: text("ingredients"),
  allergens: text("allergens"),
  nutritionInfo: text("nutrition_info"),
  imageUrl: varchar("image_url", { length: 500 }),
  preparationTime: integer("preparation_time"), // in minutes
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id", { length: 100 }).notNull().unique(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  customerId: integer("customer_id").references(() => users.id),
  orderNumber: varchar("order_number", { length: 50 }).notNull(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // sale, refund, void
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // cash, card, wallet, mobile
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  notes: text("notes"),
  receiptNumber: varchar("receipt_number", { length: 100 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const walletTopups = pgTable("wallet_topups", {
  id: serial("id").primaryKey(),
  topupId: varchar("topup_id", { length: 100 }).notNull().unique(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentReference: varchar("payment_reference", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, completed, failed, cancelled
  description: text("description"),
  transactionFee: decimal("transaction_fee", { precision: 10, scale: 2 }).default("0"),
  finalAmount: decimal("final_amount", { precision: 10, scale: 2 }).notNull(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const storeManagers = pgTable("store_managers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("manager"), // manager, supervisor, assistant_manager
  permissions: text("permissions"), // JSON string of permissions
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 10 }),
  contactNumber: varchar("contact_number", { length: 20 }),
  emergencyContact: varchar("emergency_contact", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  topupFrequency: varchar("topup_frequency", { length: 50 }).notNull(), // monthly, weekly, quarterly, yearly
  amountPerEmployee: decimal("amount_per_employee", { precision: 10, scale: 2 }).notNull(),
  locations: text("locations").array(),
  rollover: boolean("rollover").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertDashboardStatsSchema = createInsertSchema(dashboardStats).omit({
  id: true,
  updatedAt: true,
});

export const insertRevenueDataSchema = createInsertSchema(revenueData).omit({
  id: true,
});

export const insertActivityDataSchema = createInsertSchema(activityData).omit({
  id: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
});

export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
  createdAt: true,
});

export const insertMenuSchema = createInsertSchema(menus).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertWalletTopupSchema = createInsertSchema(walletTopups).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertStoreManagerSchema = createInsertSchema(storeManagers).omit({
  id: true,
  createdAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type DashboardStats = typeof dashboardStats.$inferSelect;
export type InsertDashboardStats = z.infer<typeof insertDashboardStatsSchema>;

export type RevenueData = typeof revenueData.$inferSelect;
export type InsertRevenueData = z.infer<typeof insertRevenueDataSchema>;

export type ActivityData = typeof activityData.$inferSelect;
export type InsertActivityData = z.infer<typeof insertActivityDataSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;

export type Menu = typeof menus.$inferSelect;
export type InsertMenu = z.infer<typeof insertMenuSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type WalletTopup = typeof walletTopups.$inferSelect;
export type InsertWalletTopup = z.infer<typeof insertWalletTopupSchema>;

export type StoreManager = typeof storeManagers.$inferSelect;
export type InsertStoreManager = z.infer<typeof insertStoreManagerSchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

// Extended types for API responses
export type OrderWithUserAndProduct = Order & {
  user: User;
  product: Product;
};
