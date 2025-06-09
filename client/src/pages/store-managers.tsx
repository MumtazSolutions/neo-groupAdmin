
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search, Users, CheckCircle, Store as StoreIcon, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertStoreManagerSchema, type StoreManager, type InsertStoreManager, type Store, type User } from "@shared/schema";

export default function StoreManagers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<StoreManager | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: storeManagers, isLoading } = useQuery<StoreManager[]>({
    queryKey: ["/api/store-managers"],
  });

  const { data: stores } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const form = useForm<InsertStoreManager>({
    resolver: zodResolver(insertStoreManagerSchema),
    defaultValues: {
      userId: 0,
      storeId: 0,
      role: "manager",
      startDate: new Date(),
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertStoreManager) => {
      return await apiRequest("POST", "/api/store-managers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store-managers"] });
      toast({ title: "Store manager created successfully" });
      setIsAddDialogOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertStoreManager }) => {
      return await apiRequest("PATCH", `/api/store-managers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store-managers"] });
      toast({ title: "Store manager updated successfully" });
      setEditingManager(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/store-managers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store-managers"] });
      toast({ title: "Store manager deleted successfully" });
    },
  });

  const handleEditManager = (manager: StoreManager) => {
    setEditingManager(manager);
    form.reset({
      userId: manager.userId,
      storeId: manager.storeId,
      role: manager.role,
      startDate: manager.startDate,
      endDate: manager.endDate || undefined,
      isActive: manager.isActive,
      salary: manager.salary || undefined,
      currency: manager.currency || undefined,
      contactNumber: manager.contactNumber || undefined,
      emergencyContact: manager.emergencyContact || undefined,
      notes: manager.notes || undefined,
    });
  };

  const onSubmit = (data: InsertStoreManager) => {
    if (editingManager) {
      updateMutation.mutate({ id: editingManager.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this store manager?")) {
      deleteMutation.mutate(id);
    }
  };

  const getManagerUser = (userId: number) => {
    return users?.find(user => user.id === userId);
  };

  const getManagerStore = (storeId: number) => {
    return stores?.find(store => store.id === storeId);
  };

  const getStatsData = () => {
    if (!storeManagers) return { total: 0, active: 0, storesManaged: 0, unassigned: 0 };
    
    const total = storeManagers.length;
    const active = storeManagers.filter(m => m.isActive).length;
    const storesManaged = new Set(storeManagers.map(m => m.storeId)).size;
    const unassigned = (stores?.length || 0) - storesManaged;

    return { total, active, storesManaged, unassigned };
  };

  const stats = getStatsData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground">Loading store managers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store Managers</h1>
          <p className="text-muted-foreground">Create and assign store managers to locations</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Store Manager</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users?.map((user) => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="storeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select store" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stores?.map((store) => (
                              <SelectItem key={store.id} value={store.id.toString()}>
                                {store.storeName}
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="assistant_manager">Assistant Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter salary"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
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
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Manager"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Managers</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <span className="ml-2 text-xs text-green-600">+2 this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{stats.active}</p>
                <span className="ml-2 text-xs text-green-600">83% active rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <StoreIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Stores Managed</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{stats.storesManaged}</p>
                <span className="ml-2 text-xs text-blue-600">2.3 avg per manager</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{stats.unassigned}</p>
                <span className="ml-2 text-xs text-orange-600">Needs attention</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search managers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {stores?.map((store) => (
              <SelectItem key={store.id} value={store.id.toString()}>
                {store.storeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Managers Grid */}
      <div className="grid gap-6">
        {storeManagers && storeManagers.length > 0 ? (
          storeManagers.map((manager) => {
            const user = getManagerUser(manager.userId);
            const store = getManagerStore(manager.storeId);
            
            return (
              <Card key={manager.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {user?.name?.substring(0, 2).toUpperCase() || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{user?.name || "Unknown User"}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditManager(manager)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(manager.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Store</Label>
                      <p className="text-sm">{store?.storeName || "Unknown Store"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                      <p className="text-sm capitalize">{manager.role}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant={manager.isActive ? "default" : "secondary"}>
                        {manager.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  {store && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Assigned Stores: <span className="font-medium text-blue-600">
                            {store.storeName}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-green-600">
                            {manager.isActive ? "Active" : "Inactive"}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            Manage Stores
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            Assign Stores
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No store managers found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Manager Dialog */}
      <Dialog open={!!editingManager} onOpenChange={() => setEditingManager(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Store Manager</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users?.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select store" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {stores?.map((store) => (
                            <SelectItem key={store.id} value={store.id.toString()}>
                              {store.storeName}
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="assistant_manager">Assistant Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter salary"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
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
                    setEditingManager(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update Manager"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
