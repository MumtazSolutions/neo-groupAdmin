import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Users, ShoppingCart, TrendingUp, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import type { DashboardStats } from "@shared/schema";

export function StatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statsData = [
    {
      title: "Total Revenue",
      value: `$${Number(stats.totalRevenue).toLocaleString()}`,
      change: `+${stats.revenueChange}% from last month`,
      isPositive: Number(stats.revenueChange) > 0,
      icon: DollarSign,
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: `+${stats.usersChange}% from last week`,
      isPositive: Number(stats.usersChange) > 0,
      icon: Users,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: `${stats.ordersChange}% from yesterday`,
      isPositive: Number(stats.ordersChange) > 0,
      icon: ShoppingCart,
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      change: `+${stats.conversionChange}% from last month`,
      isPositive: Number(stats.conversionChange) > 0,
      icon: TrendingUp,
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        const ChangeIcon = stat.isPositive ? ArrowUpIcon : ArrowDownIcon;
        
        return (
          <Card key={stat.title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-1 flex items-center ${
                    stat.isPositive 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    <ChangeIcon className="w-3 h-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
