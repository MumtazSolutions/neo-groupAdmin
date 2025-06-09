import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Search, Trash2, Edit, Package, Camera, Upload, History } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product, InsertProduct } from "@shared/schema";
import { insertProductSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Product categories from the images
const productCategories = [
  "Cold Coffee, Tea & Milk",
  "Coffee",
  "Tea",
  "Milk",
  "Chocolates",
  "Ice Creams",
  "Snacks",
  "Biscuits",
  "Sandwich & Burger",
  "Curd Rice Combos",
  "Rice & Curry Combo",
  "Rice & 2 Curries Combo",
  "Pulaos & Rice Items",
  "Bakery Items",
  "Chaat & Pani Puri",
  "Combo Items",
  "Breakfast",
  "Roti & Paratha",
  "Evening Snacks",
  "Starters",
  "Lunch & Dinner",
  "Noodles",
  "Beverages",
  "Combos",
  "Meals",
  "Fruit Juice",
  "Vegetable Juice",
  "Fruit Salad & Lassi",
  "Milkshakes",
  "Pastries",
  "Desserts",
  "Puffs & Rolls"
];

// Category to subcategory mapping
const categorySubcategoryMap: { [key: string]: string[] } = {
  "Cold Coffee, Tea & Milk": ["Cold Coffee", "Tea", "Milk", "Iced Tea", "Milkshakes"],
  "Coffee": ["Espresso", "Americano", "Cappuccino", "Latte", "Mocha", "Cold Brew"],
  "Tea": ["Black Tea", "Green Tea", "Herbal Tea", "Masala Chai", "Iced Tea", "Earl Grey"],
  "Milk": ["Fresh Milk", "Flavored Milk", "Buttermilk", "Lassi", "Milk-based Drinks"],
  "Chocolates": ["Dark Chocolate", "Milk Chocolate", "White Chocolate", "Chocolate Bars", "Chocolate Drinks"],
  "Ice Creams": ["Vanilla", "Chocolate", "Strawberry", "Kulfi", "Fruit Ice Cream", "Premium Ice Cream"],
  "Snacks": ["Chips", "Crackers", "Nuts", "Popcorn", "Trail Mix", "Namkeen"],
  "Biscuits": ["Sweet Biscuits", "Salty Biscuits", "Cookies", "Wafers", "Cream Biscuits"],
  "Sandwich & Burger": ["Veg Sandwich", "Non-Veg Sandwich", "Veg Burger", "Non-Veg Burger", "Grilled Sandwich"],
  "Curd Rice Combos": ["Plain Curd Rice", "Pickle Curd Rice", "Papad Curd Rice", "Special Curd Rice"],
  "Rice & Curry Combo": ["Dal Rice", "Sambar Rice", "Rasam Rice", "Curry Rice"],
  "Rice & 2 Curries Combo": ["Dal + Sambar Rice", "Curry + Dal Rice", "Mixed Curry Rice"],
  "Pulaos & Rice Items": ["Veg Pulao", "Chicken Pulao", "Mutton Pulao", "Biryani", "Fried Rice"],
  "Bakery Items": ["Bread", "Cakes", "Pastries", "Muffins", "Croissants", "Donuts"],
  "Chaat & Pani Puri": ["Pani Puri", "Bhel Puri", "Sev Puri", "Dahi Puri", "Aloo Chaat"],
  "Combo Items": ["Meal Combos", "Snack Combos", "Beverage Combos", "Family Packs"],
  "Breakfast": ["South Indian", "North Indian", "Continental", "Healthy Options"],
  "Roti & Paratha": ["Plain Roti", "Butter Roti", "Aloo Paratha", "Paneer Paratha", "Mixed Paratha"],
  "Evening Snacks": ["Samosa", "Pakora", "Vada", "Cutlet", "Spring Rolls"],
  "Starters": ["Veg Starters", "Non-Veg Starters", "Paneer Items", "Chicken Items"],
  "Lunch & Dinner": ["Veg Meals", "Non-Veg Meals", "Thali", "Rice Meals"],
  "Noodles": ["Veg Noodles", "Chicken Noodles", "Hakka Noodles", "Schezwan Noodles"],
  "Beverages": ["Soft Drinks", "Juices", "Energy Drinks", "Water", "Hot Beverages"],
  "Combos": ["Value Combos", "Family Combos", "Student Combos", "Special Combos"],
  "Meals": ["Breakfast Meals", "Lunch Meals", "Dinner Meals", "Mini Meals"],
  "Fruit Juice": ["Orange Juice", "Apple Juice", "Mixed Fruit", "Seasonal Fruits"],
  "Vegetable Juice": ["Carrot Juice", "Beetroot Juice", "Mixed Veg", "Green Juice"],
  "Fruit Salad & Lassi": ["Fresh Fruit Salad", "Sweet Lassi", "Salty Lassi", "Fruit Lassi"],
  "Milkshakes": ["Vanilla Shake", "Chocolate Shake", "Strawberry Shake", "Oreo Shake"],
  "Pastries": ["Black Forest", "Chocolate Pastry", "Vanilla Pastry", "Red Velvet"],
  "Desserts": ["Ice Cream", "Cakes", "Puddings", "Traditional Sweets"],
  "Puffs & Rolls": ["Veg Puff", "Egg Puff", "Chicken Puff", "Paneer Roll", "Egg Roll"],
  // Non-Veg Categories
  "Chicken Items": ["Chicken Curry", "Chicken Fry", "Chicken Biryani", "Chicken Tikka", "Chicken 65"],
  "Mutton Items": ["Mutton Curry", "Mutton Biryani", "Mutton Fry", "Mutton Chops", "Mutton Kebab"],
  "Fish Items": ["Fish Curry", "Fish Fry", "Fish Biryani", "Grilled Fish", "Fish Tikka"],
  "Egg Items": ["Egg Curry", "Boiled Eggs", "Scrambled Eggs", "Egg Biryani", "Omelette"],
  "Non-Veg Starters": ["Chicken Tikka", "Mutton Seekh", "Fish Fry", "Prawn Fry", "Chicken Wings"],
  "Non-Veg Meals": ["Chicken Meal", "Mutton Meal", "Fish Meal", "Mixed Non-Veg Meal"],
  "Non-Veg Combos": ["Chicken Combo", "Mutton Combo", "Fish Combo", "Mixed Non-Veg Combo"],
  "Chicken Noodles": ["Chicken Hakka", "Chicken Schezwan", "Chicken Fried Noodles"],
  "Mutton Biryani": ["Hyderabadi Mutton", "Lucknowi Mutton", "Kolkata Mutton", "Special Mutton"],
  "Chicken Biryani": ["Hyderabadi Chicken", "Lucknowi Chicken", "Kolkata Chicken", "Special Chicken"],
  "Egg Fried Rice": ["Plain Egg Rice", "Schezwan Egg Rice", "Mixed Egg Rice"],
  "Non-Veg Breakfast": ["Egg Paratha", "Chicken Sandwich", "Mutton Keema", "Fish Curry Rice"],
  "Chicken Curry": ["Butter Chicken", "Chicken Masala", "Chicken Korma", "Spicy Chicken"],
  "Mutton Curry": ["Mutton Masala", "Mutton Korma", "Mutton Rogan Josh", "Spicy Mutton"],
  "Fish Curry": ["Fish Masala", "Fish Korma", "Coconut Fish", "Spicy Fish"]
};

const units = [
  "PLATES (PLT)",
  "PIECES (PCS)",
  "PAIRS (PRS)",
  "BOX (BOX)",
  "KILOGRAMS (KGS)",
  "GRAMS (GMS)",
  "METERS (MTR)",
  "NUMBERS (NOS)"
];

const orderTypes = ["Dine In (Self Service)"];

const taxOptions = [
  "Tax Exempted",
  "GST @ 0%",
  "GST @ 3%",
  "GST @ 5%",
  "GST @ 12%",
  "GST @ 14%",
  "GST @ 16%",
  "GST @ 18%",
  "GST @ 28%",
  "GST @ 28% + Cess @ 12%",
  "GST @ 28% + Cess @ 60%"
];

// Veg and Non-Veg Categories
const vegCategories = [
  "Cold Coffee, Tea & Milk",
  "Coffee",
  "Tea",
  "Milk",
  "Chocolates",
  "Ice Creams",
  "Snacks",
  "Biscuits",
  "Curd Rice Combos",
  "Rice & Curry Combo",
  "Rice & 2 Curries Combo",
  "Pulaos & Rice Items",
  "Bakery Items",
  "Chaat & Pani Puri",
  "Combo Items",
  "Breakfast",
  "Roti & Paratha",
  "Evening Snacks",
  "Starters",
  "Lunch & Dinner",
  "Noodles",
  "Beverages",
  "Combos",
  "Meals",
  "Fruit Juice",
  "Vegetable Juice",
  "Fruit Salad & Lassi",
  "Milkshakes",
  "Pastries",
  "Desserts",
  "Puffs & Rolls"
];

const nonVegCategories = [
  "Sandwich & Burger",
  "Chicken Items",
  "Mutton Items",
  "Fish Items",
  "Egg Items",
  "Non-Veg Starters",
  "Non-Veg Meals",
  "Non-Veg Combos",
  "Chicken Noodles",
  "Mutton Biryani",
  "Chicken Biryani",
  "Egg Fried Rice",
  "Non-Veg Breakfast",
  "Chicken Curry",
  "Mutton Curry",
  "Fish Curry"
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState("");
  const [selectedTax, setSelectedTax] = useState("GST @ 5%");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const { toast } = useToast();
  const [categorization, setCategorization] = useState("veg"); // 'veg' or 'non-veg'
  const [availableCategories, setAvailableCategories] = useState(vegCategories); // State to hold filtered categories

  const form = useForm<InsertProduct & {
    itemType: "service" | "goods";
    shortDescription: string;
    unit: string;
    shortCode: string;
    displayOrder: string;
    hsnSacCode: string;
    orderType: string;
    itemCategory: string;
    itemSubCategory: string;
    additionalCategories: string[];
    inStock: boolean;
    sellingPrice: string;
    discountedPrice: string;
    taxIncluded: boolean;
    gstTax: string;
    packagingCharges: string;
    trackInventory: boolean;
    quantityInStock: string;
    purchasePrice: string;
    quantityOrdered: string;
    imageUrl: string;
  }>({
    resolver: zodResolver(insertProductSchema.extend({
      itemType: insertProductSchema.shape.category,
      shortDescription: insertProductSchema.shape.description,
      unit: insertProductSchema.shape.category,
      shortCode: insertProductSchema.shape.category,
      displayOrder: insertProductSchema.shape.category,
      hsnSacCode: insertProductSchema.shape.category,
      orderType: insertProductSchema.shape.category,
      itemCategory: insertProductSchema.shape.category,
      itemSubCategory: insertProductSchema.shape.category,
      additionalCategories: insertProductSchema.shape.category,
      inStock: insertProductSchema.shape.isActive,
      sellingPrice: insertProductSchema.shape.price,
      discountedPrice: insertProductSchema.shape.price,
      taxIncluded: insertProductSchema.shape.isActive,
      gstTax: insertProductSchema.shape.category,
      packagingCharges: insertProductSchema.shape.price,
      trackInventory: insertProductSchema.shape.isActive,
      quantityInStock: insertProductSchema.shape.stock,
      purchasePrice: insertProductSchema.shape.price,
      quantityOrdered: insertProductSchema.shape.stock,
      imageUrl: insertProductSchema.shape.description,
    }).partial()),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
      category: "",
      stock: 0,
      isActive: true,
      itemType: "goods",
      shortDescription: "",
      unit: "",
      shortCode: "",
      displayOrder: "",
      hsnSacCode: "",
      orderType: "",
      itemCategory: "",
      itemSubCategory: "",
      additionalCategories: [],
      inStock: true,
      sellingPrice: "",
      discountedPrice: "",
      taxIncluded: false,
      gstTax: "GST @ 5%",
      packagingCharges: "",
      trackInventory: false,
      quantityInStock: "",
      purchasePrice: "",
      quantityOrdered: "",
      imageUrl: "",
    },
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      return await apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product created successfully" });
      setIsAddDialogOpen(false);
      form.reset();
      setSelectedCategories([]);
      setSelectedUnit("");
      setSelectedOrderType("");
      setSelectedCategory("");
      setAvailableSubcategories([]);
      setCategorization("veg");
      setAvailableCategories(vegCategories);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertProduct }) => {
      return await apiRequest("PUT", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product updated successfully" });
      setEditingProduct(null);
      form.reset();
      setSelectedCategories([]);
      setSelectedUnit("");
      setSelectedOrderType("");
      setSelectedCategory("");
      setAvailableSubcategories([]);
      setCategorization("veg");
      setAvailableCategories(vegCategories);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "0",
      category: product.category || "",
      stock: product.stock || 0,
      isActive: product.isActive,
    });
  };

  const onSubmit = (data: any) => {
    const productData: InsertProduct = {
      name: data.name,
      description: data.description,
      price: data.sellingPrice || data.price,
      category: data.itemCategory || data.category,
      stock: data.quantityInStock ? parseInt(data.quantityInStock.toString()) : (data.stock || 0),
      isActive: data.isActive && data.inStock,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your product catalog</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <History className="w-4 h-4 mr-2" />
              Bulk price edit
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-500">Basic Information</h3>

                    {/* Product Image */}
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Image (W: 600 x H: 600) *</FormLabel>
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                            <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">Take Photo or Upload</p>
                            <Input 
                              type="file" 
                              accept="image/*" 
                              className="mt-4"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(URL.createObjectURL(file));
                                }
                              }}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Item Type */}
                    <FormField
                      control={form.control}
                      name="itemType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Type</FormLabel>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex space-x-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="service" id="service" />
                              <Label htmlFor="service">Service</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="goods" id="goods" />
                              <Label htmlFor="goods">Goods</Label>
                            </div>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tap to enter" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Short Description */}
                    <FormField
                      control={form.control}
                      name="shortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Tap to enter" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tap to enter" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Unit */}
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Tap to select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Short Code / Display Order */}
                    <FormField
                      control={form.control}
                      name="shortCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Code / Display Order</FormLabel>
                          <FormControl>
                            <Input placeholder="Tap to enter" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Additional Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Additional Information</h3>
                    {/* Categorization */}
                    <FormField
                      control={form.control}
                      name="categorization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Type</FormLabel>
                          <RadioGroup
                            value={categorization}
                            onValueChange={(value) => {
                              setCategorization(value);
                              field.onChange(value);
                              if (value === "veg") {
                                setAvailableCategories(vegCategories);
                              } else {
                                setAvailableCategories(nonVegCategories);
                              }
                              setSelectedCategory(""); // Reset selected category
                              setAvailableSubcategories([]); // Reset subcategories
                              form.setValue("itemSubCategory", ""); // Reset subcategory field
                            }}
                            className="flex space-x-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="veg" id="veg" />
                              <Label htmlFor="veg">Veg</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="non-veg" id="non-veg" />
                              <Label htmlFor="non-veg">Non-Veg</Label>
                            </div>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* HSN/SAC Code */}
                    <FormField
                      control={form.control}
                      name="hsnSacCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HSN/SAC Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Tap to enter" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Order Type */}
                    <FormField
                      control={form.control}
                      name="orderType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Type</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Tap to select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {orderTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Item Category */}
                    <FormField
                      control={form.control}
                      name="itemCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Category</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedCategory(value);
                              setAvailableSubcategories(categorySubcategoryMap[value] || []);
                              // Reset subcategory when category changes
                              form.setValue("itemSubCategory", "");
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Tap to select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Item Sub Category */}
                    <FormField
                      control={form.control}
                      name="itemSubCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Sub Category</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!selectedCategory}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={selectedCategory ? "Tap to select" : "Select category first"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableSubcategories.map((subcategory) => (
                                <SelectItem key={subcategory} value={subcategory}>
                                  {subcategory}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Additional Categories */}
                    <div className="space-y-2">
                      <Label>Additional Categories</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-4 border rounded">
                        {productCategories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={category}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategories([...selectedCategories, category]);
                                } else {
                                  setSelectedCategories(selectedCategories.filter(c => c !== category));
                                }
                              }}
                            />
                            <Label htmlFor={category} className="text-sm">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* In Stock */}
                    <FormField
                      control={form.control}
                      name="inStock"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>In Stock</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Active */}
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>Active</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Sales Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-500">Sales</h3>

                    {/* Selling Price */}
                    <FormField
                      control={form.control}
                      name="sellingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selling Price *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Tap to enter"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Discounted Price */}
                    <FormField
                      control={form.control}
                      name="discountedPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discounted Price *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Tap to enter"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tax Included */}
                    <FormField
                      control={form.control}
                      name="taxIncluded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax included?</FormLabel>
                          <RadioGroup
                            value={field.value ? "yes" : "no"}
                            onValueChange={(value) => field.onChange(value === "yes")}
                            className="flex space-x-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="no" />
                              <Label htmlFor="no">No</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="yes" />
                              <Label htmlFor="yes">Yes</Label>
                            </div>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* GST Tax */}
                    <FormField
                      control={form.control}
                      name="gstTax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Tax</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Tap to select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {taxOptions.map((tax) => (
                                <SelectItem key={tax} value={tax}>
                                  {tax}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Packaging Charges */}
                    <FormField
                      control={form.control}
                      name="packagingCharges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Packaging Charges</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Tap to enter"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Track Inventory Section */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="trackInventory"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="text-yellow-500">Track inventory for this item</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Quantity in Stock */}
                    <FormField
                      control={form.control}
                      name="quantityInStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity in Stock</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Tap to enter"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Purchase Price */}
                    <FormField
                      control={form.control}
                      name="purchasePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Tap to enter"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Quantity Ordered */}
                    <FormField
                      control={form.control}
                      name="quantityOrdered"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity Ordered</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Tap to enter"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        form.reset();
                        setSelectedCategories([]);
                        setSelectedUnit("");
                        setSelectedOrderType("");
                        setSelectedCategory("");
                        setAvailableSubcategories([]);
                        setCategorization("veg");
                        setAvailableCategories(vegCategories);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Creating..." : "Create Product"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            All Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredProducts.map((product) => (
                  <TableRow 
                    key={product.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {product.category || "Uncategorized"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white font-medium">
                      ${Number(product.price).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {product.stock}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.isActive ? "default" : "secondary"}
                        className={product.isActive ? 
                          "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300" :
                          "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
                        }
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {formatDate(product.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter product description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter stock quantity"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Active</FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingProduct(null);
                    form.reset();
                    setSelectedCategories([]);
                    setSelectedUnit("");
                    setSelectedOrderType("");
                    setSelectedCategory("");
                    setAvailableSubcategories([]);
                    setCategorization("veg");
                    setAvailableCategories(vegCategories);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}