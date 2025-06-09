import { Link, useLocation } from "wouter";
import { useState } from "react";
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  FileText, 
  Settings, 
  User,
  LogOut,
  X,
  Zap,
  MapPin,
  Store,
  ChefHat,
  CreditCard,
  Wallet,
  UserCheck,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { 
      href: "/", 
      label: "Dashboard", 
      icon: BarChart3, 
      active: location === "/" 
    },
    { 
      href: "/users", 
      label: "Users", 
      icon: Users, 
      badge: "324",
      active: location === "/users" 
    },
    { 
      href: "/products", 
      label: "Products", 
      icon: Package,
      active: location === "/products" 
    },
    { 
      href: "/orders", 
      label: "Orders", 
      icon: ShoppingCart, 
      badge: "12", 
      badgeVariant: "destructive",
      active: location === "/orders" 
    },
    { 
      href: "/analytics", 
      label: "Analytics", 
      icon: TrendingUp,
      active: location === "/analytics" 
    },
    { 
      href: "/reports", 
      label: "Reports", 
      icon: FileText,
      active: location === "/reports" 
    },
    { 
      href: "/locations", 
      label: "Locations", 
      icon: MapPin,
      active: location === "/locations" 
    },
    { 
      href: "/companies", 
      label: "Companies", 
      icon: Building2,
      active: location === "/companies" 
    },
    { 
      href: "/stores", 
      label: "Stores", 
      icon: Store,
      active: location === "/stores" 
    },
    { 
      href: "/menus", 
      label: "Menus", 
      icon: ChefHat,
      active: location === "/menus" 
    },
    { 
      href: "/transactions", 
      label: "Transactions", 
      icon: CreditCard,
      active: location === "/transactions" 
    },
    { 
      href: "/wallet-topups", 
      label: "Wallet Topups", 
      icon: Wallet,
      active: location === "/wallet-topups" 
    },
    { 
      href: "/store-managers", 
      label: "Store Managers", 
      icon: UserCheck,
      active: location === "/store-managers" 
    },
  ];

  const teamItems = [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Neo Group</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${item.active 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}>
                  <Icon className={`
                    mr-3 h-4 w-4
                    ${item.active ? 'text-primary' : 'text-gray-400'}
                  `} />
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant={item.badgeVariant as "default" | "destructive" || "secondary"}
                      className="ml-auto text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Team
            </h3>
            <div className="mt-2 space-y-1">
              {teamItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                    <Icon className="text-gray-400 mr-3 h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=40&h=40" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Administrator
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
