import { StatsCards } from "@/components/dashboard/stats-cards";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { OrdersTable } from "@/components/dashboard/orders-table";

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <StatsCards />
      <ChartsSection />
      <OrdersTable />
    </div>
  );
}
