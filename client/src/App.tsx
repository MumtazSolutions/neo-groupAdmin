import { Switch, Route, useLocation } from "wouter";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/users";
import Products from "@/pages/products";
import Orders from "@/pages/orders";
import Analytics from "@/pages/analytics";
import Reports from "@/pages/reports";
import Locations from "@/pages/locations";
import Stores from "@/pages/stores";
import Menus from "@/pages/menus";
import Transactions from "@/pages/transactions";
import WalletTopups from "@/pages/wallet-topups";
import StoreManagers from "@/pages/store-managers";
import Companies from "@/pages/companies";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Dashboard";
      case "/users":
        return "Users";
      case "/products":
        return "Products";
      case "/orders":
        return "Orders";
      case "/analytics":
        return "Analytics";
      case "/reports":
        return "Reports";
      case "/locations":
        return "Locations";
      case "/companies":
        return "Companies";
      case "/stores":
        return "Stores";
      case "/menus":
        return "Menus";
      case "/transactions":
        return "Transactions";
      case "/wallet-topups":
        return "Wallet Topups";
      case "/store-managers":
        return "Store Managers";
      default:
        return "Dashboard";
    }
  };

  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={getPageTitle(location)} 
          onMenuClick={openSidebar}
        />
        
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
          <div className="w-full max-w-none">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/users" component={Users} />
              <Route path="/products" component={Products} />
              <Route path="/orders" component={Orders} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/reports" component={Reports} />
              <Route path="/locations" component={Locations} />
              <Route path="/companies" component={Companies} />
              <Route path="/stores" component={Stores} />
              <Route path="/menus" component={Menus} />
              <Route path="/transactions" component={Transactions} />
              <Route path="/wallet-topups" component={WalletTopups} />
              <Route path="/store-managers" component={StoreManagers} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="neogroup-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
