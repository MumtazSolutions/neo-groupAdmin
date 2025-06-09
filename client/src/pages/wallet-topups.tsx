import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Edit, Trash2, Wallet } from "lucide-react";
import type { WalletTopup, InsertWalletTopup, User } from "@shared/schema";
import { insertWalletTopupSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = ["credit_card", "debit_card", "bank_transfer", "mobile_money", "paypal", "stripe"];
const topupStatuses = ["pending", "completed", "failed", "cancelled"];

const currencies = [
  { code: "INR", name: "Indian Rupee" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "AED", name: "UAE Dirham" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "USD", name: "US Dollar" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "BHD", name: "Bahraini Dinar" },
  { code: "NPR", name: "Nepalese Rupee" },
  { code: "XCD", name: "East Caribbean Dollar" },
];

export default function WalletTopups() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTopup, setEditingTopup] = useState<WalletTopup | null>(null);
  const { toast } = useToast();

  const { data: topups, isLoading } = useQuery<WalletTopup[]>({
    queryKey: ["/api/wallet-topups"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const form = useForm<InsertWalletTopup>({
    resolver: zodResolver(insertWalletTopupSchema),
    defaultValues: {
      topupId: "",
      userId: undefined,
      amount: "",
      currency: "",
      paymentMethod: "",
      paymentReference: "",
      status: "pending",
      description: "",
      transactionFee: "",
      finalAmount: "",
    },
  });

  const createTopupMutation = useMutation({
    mutationFn: async (data: InsertWalletTopup) => {
      await apiRequest("POST", "/api/wallet-topups", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet-topups"] });
      form.reset();
      setIsDialogOpen(false);
      setEditingTopup(null);
      toast({
        title: "Success",
        description: "Wallet topup saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save wallet topup",
        variant: "destructive",
      });
    },
  });

  const updateTopupMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertWalletTopup }) => {
      await apiRequest("PUT", `/api/wallet-topups/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet-topups"] });
      form.reset();
      setIsDialogOpen(false);
      setEditingTopup(null);
      toast({
        title: "Success",
        description: "Wallet topup updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update wallet topup",
        variant: "destructive",
      });
    },
  });

  const deleteTopupMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/wallet-topups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet-topups"] });
      toast({
        title: "Success",
        description: "Wallet topup deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete wallet topup",
        variant: "destructive",
      });
    },
  });

  const filteredTopups =
    topups?.filter(
      (topup) =>
        topup.topupId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topup.paymentReference?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const handleAddTopup = () => {
    setEditingTopup(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleEditTopup = (topup: WalletTopup) => {
    setEditingTopup(topup);
    form.reset({
      topupId: topup.topupId,
      userId: topup.userId,
      amount: topup.amount,
      currency: topup.currency,
      paymentMethod: topup.paymentMethod,
      paymentReference: topup.paymentReference || "",
      status: topup.status,
      description: topup.description || "",
      transactionFee: topup.transactionFee || "",
      finalAmount: topup.finalAmount,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTopup = (id: number) => {
    if (confirm("Are you sure you want to delete this wallet topup?")) {
      deleteTopupMutation.mutate(id);
    }
  };

  const onSubmit = (data: InsertWalletTopup) => {
    if (editingTopup) {
      updateTopupMutation.mutate({ id: editingTopup.id, data });
    } else {
      createTopupMutation.mutate(data);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Wallet Topup Management
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddTopup} className="bg-teal-600 hover:bg-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet Topup
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTopup ? "Edit Wallet Topup" : "Add New Wallet Topup"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="topupId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topup ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter topup ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || ""}>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currencies.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.code} - {currency.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                  {method.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
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
                      name="paymentReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Reference</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter payment reference (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="transactionFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction Fee</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="finalAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Final Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {topupStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
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
                          <Textarea
                            placeholder="Enter topup description (optional)"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        createTopupMutation.isPending ||
                        updateTopupMutation.isPending
                      }
                    >
                      {editingTopup ? "Update Topup" : "Save Topup"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search wallet topups..."
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
            All Wallet Topups ({filteredTopups.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Topup
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment Method
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fee
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Final Amount
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-10 w-48" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                      </TableRow>
                    ))
                  : filteredTopups.map((topup) => (
                      <TableRow
                        key={topup.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mr-3">
                              <Wallet className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white font-mono">
                                {topup.topupId}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {topup.paymentReference || "No reference"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">
                          {users?.find(u => u.id === topup.userId)?.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white font-medium">
                          {topup.currency} {topup.amount}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">
                          {topup.paymentMethod.replace("_", " ")}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">
                          {topup.currency} {topup.transactionFee || "0.00"}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white font-medium">
                          {topup.currency} {topup.finalAmount}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            topup.status === "completed" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : topup.status === "failed"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : topup.status === "cancelled"
                              ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}>
                            {topup.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-400">
                          {formatDate(topup.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTopup(topup)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTopup(topup.id)}
                              disabled={deleteTopupMutation.isPending}
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
    </div>
  );
}