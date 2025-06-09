
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Store, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: revenueData } = useQuery({
    queryKey: ["/api/dashboard/revenue"],
  });

  const { data: activity } = useQuery({
    queryKey: ["/api/dashboard/activity"],
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["/api/orders/recent"],
  });

  const { data: stores } = useQuery({
    queryKey: ["/api/stores"],
  });

  // Mock top performing stores data (you can replace with actual API)
  const topStores = [
    { name: "Burger Palace", location: "Downtown Food Court", revenue: "$2,847", change: "+10%" },
    { name: "Pizza Corner", location: "Mall Food Plaza", revenue: "$2,156", change: "+8%" },
    { name: "Sushi Express", location: "Business District", revenue: "$923", change: "+5%" },
    { name: "Taco Fiesta", location: "University Campus", revenue: "$687", change: "+2%" },
    { name: "Coffee Central", location: "Airport Terminal", revenue: "$432", change: "-2%" },
  ];

  // Mock recent activity data
  const recentActivity = [
    { type: "company", text: 'New company "TechCorp" registered', time: "2 minutes ago", icon: Building2 },
    { type: "menu", text: 'Store "Pizza Palace" updated menu', time: "15 minutes ago", icon: Store },
    { type: "topup", text: 'Wallet top-up completed for "StartupXYZ"', time: "1 hour ago", icon: DollarSign },
    { type: "manager", text: 'New store manager assigned to "Burger Hub"', time: "3 hours ago", icon: Store },
    { type: "report", text: "Daily report sent to 12 companies", time: "1 day ago", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your food court management system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">
                {stats?.totalCompanies || 24}
              </div>
              <div className="text-sm text-muted-foreground">Total Companies</div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600">+12%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Store className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">
                {stats?.totalStores || stores?.length || 156}
              </div>
              <div className="text-sm text-muted-foreground">Active Stores</div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600">+8%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">
                {stats?.totalOrders || 1247}
              </div>
              <div className="text-sm text-muted-foreground">Today's Orders</div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600">+23%</span>
                <span className="text-muted-foreground ml-1">from yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">
                ${stats?.totalRevenue?.toLocaleString() || "45,231"}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600">+15%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Overview</CardTitle>
              <Select defaultValue="3months">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="3months">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order Trends</CardTitle>
              <Select defaultValue="7days">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'company' ? 'bg-blue-100' :
                    activity.type === 'menu' ? 'bg-green-100' :
                    activity.type === 'topup' ? 'bg-purple-100' :
                    activity.type === 'manager' ? 'bg-orange-100' :
                    'bg-gray-100'
                  }`}>
                    <activity.icon className={`w-4 h-4 ${
                      activity.type === 'company' ? 'text-blue-600' :
                      activity.type === 'menu' ? 'text-green-600' :
                      activity.type === 'topup' ? 'text-purple-600' :
                      activity.type === 'manager' ? 'text-orange-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Stores */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStores.map((store, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {store.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {store.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {store.revenue}
                    </p>
                    <p className={`text-xs ${
                      store.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {store.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
