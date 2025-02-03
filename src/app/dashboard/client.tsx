"use client";

import LineChartComponent from "@/components/charts/LineChartComponent";
import TransactionTableComponent from "@/components/tables/TransactionTableComponent/index";
import { columns } from "@/components/tables/TransactionTableComponent/Columns";
import { Transaction } from "plaid";
import { filterTransactionsByKeys } from "@/utils/data";
import BarChartComponent from "@/components/charts/BarChartComponent";
import SummaryCards from "@/components/dashboard-components/SummaryCards";

const desiredKeys: (keyof Transaction)[] = [
  "amount",
  "date",
  "merchant_name",
  "payment_channel",
  "iso_currency_code",
  "logo_url",
  "name",
];

export default function DashboardClient({
  transactions,
}: {
  transactions: Transaction[];
}) {
  let filteredTransactions = filterTransactionsByKeys(
    transactions,
    desiredKeys
  );
  console.log(transactions);
  // useEffect(() => {
  //   navigator.serviceWorker
  //     .register("/sw.js")
  //     .then((resistration) => console.log("Register", resistration.scope))
  //     .catch((e) => console.log(e));
  // }, []);
  // async function requestSync() {
  //   if ("serviceWorker" in navigator && "SyncManager" in window) {
  //     try {
  //       const registration = await navigator.serviceWorker.ready;
  //       await (registration as any).sync.register("sync-db");
  //       console.log("Background sync registered");
  //     } catch (err) {
  //       console.error("Sync registration failed", err);
  //     }
  //   } else {
  //     console.log("Background sync not supported");
  //     // fallback logic
  //   }
  // }

  return (
    <>
      <div id="home" className="flex flex-col space-y-5">
        <div className="grid grid-cols-3 gap-x-10 xl:gap-x-20">
          <div className="flex col-span-2 flex-col space-y-5">
            {/* Smmary cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
              {/* <SummaryCards /> */}
            </div>
            {/* Summary chart */}
            <div className="grid grid-cols-1 xl:grid-cols-2 pt-10 gap-x-20 gap-y-10">
              <LineChartComponent />
              <BarChartComponent />
              <BarChartComponent />
              <BarChartComponent />
            </div>
          </div>
          {/* Transaction History */}
          <div className="mb-10">
            <p className="font-bold text-lg mb-2">Your recent transactions</p>
            <TransactionTableComponent
              data={filteredTransactions}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </>
  );
}
