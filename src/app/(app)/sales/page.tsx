import SaleClientWrapper from "@/components/features/sales/SaleClientWrapper";
import OverallSales from "@/components/features/sales/OverallSales";
import { getAllProductsForSelect } from "@/lib/actions/products";
import { getAllCustomers } from "@/lib/actions/customers";
import { getOverallSalesStats } from "@/lib/actions/sales";

export default async function SalesPage() {
  const [products, customers, stats] = await Promise.all([
    getAllProductsForSelect(),
    getAllCustomers(),
    getOverallSalesStats(),
  ]);

  const salesStats = stats || {
    total_revenue: 0,
    total_profit: 0,
    total_transactions: 0,
    today_revenue: 0,
  };

  return (
    <div className="flex flex-col gap-3 mx-3 md:mx-0 md:mr-3">
      <OverallSales
        totalRevenue={salesStats.total_revenue}
        totalProfit={salesStats.total_profit}
        totalTransactions={salesStats.total_transactions}
        todayRevenue={salesStats.today_revenue}
      />
      <SaleClientWrapper products={products} customers={customers} />
    </div>
  );
}
