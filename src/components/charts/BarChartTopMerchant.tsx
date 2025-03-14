"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tables } from "@/types/supabase";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { formatCurrency } from "@/utils/data";
import { useTheme } from "next-themes";

const getChartColors = (theme: string | undefined) => ({
  amount: {
    light: "hsl(142, 76%, 36%)", // Green
    dark: "hsl(142, 76%, 46%)",
  },
  transactions: {
    light: "hsl(221, 83%, 53%)", // Blue
    dark: "hsl(217, 91%, 60%)",
  },
  average: {
    light: "hsl(292, 76%, 36%)", // Purple
    dark: "hsl(292, 76%, 46%)",
  },
  label: {
    light: "hsl(var(--foreground))",
    dark: "hsl(var(--foreground))",
  },
});

const chartConfig = {
  total_amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
  transaction_count: {
    label: "Transactions",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function groupTransactionsByMerchant(transactions: Tables<"Transactions">[]): {
  merchant_name: string;
  total_amount: number;
  transaction_count: number;
  average_transaction: number;
  percentage: number;
}[] {
  const grouped = new Map<
    string,
    { total_amount: number; transaction_count: number }
  >();

  let totalSpending = 0;
  for (const { merchant_name, amount } of transactions) {
    if (!merchant_name || amount === undefined || amount! < 0) continue;

    if (!grouped.has(merchant_name)) {
      grouped.set(merchant_name, { total_amount: 0, transaction_count: 0 });
    }

    const entry = grouped.get(merchant_name)!;
    entry.total_amount += amount!;
    entry.transaction_count += 1;
    totalSpending += amount!;
  }

  return Array.from(grouped.entries())
    .map(([merchant_name, { total_amount, transaction_count }]) => ({
      merchant_name,
      total_amount,
      transaction_count,
      average_transaction: total_amount / transaction_count,
      percentage: (total_amount / totalSpending) * 100,
    }))
    .filter(
      (entry) => entry.total_amount > 0 && entry.merchant_name.trim().length > 0
    );
}

const BarChartTopMerchant = React.memo(
  ({ data }: { data: Tables<"Transactions">[] | [] }) => {
    const [filterOption, setFilterOption] = useState<string>("amount");
    const [range, setRange] = useState<number>(5);
    const { theme, resolvedTheme } = useTheme();

    const chartColors = getChartColors(theme);
    const currentColor = useMemo(() => {
      switch (filterOption) {
        case "transactions":
          return (
            chartColors.transactions[theme as "light" | "dark"] ||
            chartColors.transactions.light
          );
        case "average":
          return (
            chartColors.average[theme as "light" | "dark"] ||
            chartColors.average.light
          );
        default:
          return (
            chartColors.amount[theme as "light" | "dark"] ||
            chartColors.amount.light
          );
      }
    }, [filterOption, theme, chartColors]);

    const grouped = useMemo(() => {
      const groupedData = groupTransactionsByMerchant(data);
      const sortedData =
        filterOption === "amount"
          ? groupedData.sort((a, b) => b.total_amount - a.total_amount)
          : filterOption === "transactions"
          ? groupedData.sort(
              (a, b) => b.transaction_count - a.transaction_count
            )
          : groupedData.sort(
              (a, b) => b.average_transaction - a.average_transaction
            );
      return sortedData.slice(0, range);
    }, [data, range, filterOption]);

    const summaryStats = useMemo(() => {
      const total = grouped.reduce((sum, item) => sum + item.total_amount, 0);
      const totalTransactions = grouped.reduce(
        (sum, item) => sum + item.transaction_count,
        0
      );
      const percentageOfAll = grouped.reduce(
        (sum, item) => sum + item.percentage,
        0
      );
      return {
        total,
        totalTransactions,
        percentageOfAll,
      };
    }, [grouped]);

    const getDataKey = () => {
      switch (filterOption) {
        case "amount":
          return "total_amount";
        case "transactions":
          return "transaction_count";
        case "average":
          return "average_transaction";
        default:
          return "total_amount";
      }
    };

    const formatValue = (value: number) => {
      switch (filterOption) {
        case "amount":
        case "average":
          return formatCurrency(value.toString());
        case "transactions":
          return value.toString();
        default:
          return value.toString();
      }
    };

    const formatAxisValue = (value: number) => {
      switch (filterOption) {
        case "amount":
        case "average":
          return `$${(value / 1000).toFixed(1)}k`;
        case "transactions":
          return value.toString();
        default:
          return value.toString();
      }
    };

    return (
      <Card id="top-merchants" className="shadow-none">
        <CardHeader>
          <div className="flex flex-row items-center justify-between space-x-2">
            <div className="space-y-1">
              <CardTitle>Top {range} Merchants</CardTitle>
              <CardDescription>
                {filterOption === "amount"
                  ? "Merchants by total spending"
                  : filterOption === "transactions"
                  ? "Merchants by number of transactions"
                  : "Merchants by average transaction amount"}
              </CardDescription>
              <div className="flex flex-col gap-1 mt-2">
                <p className="text-sm text-muted-foreground">
                  Total spend:{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(summaryStats.total.toString())}
                  </span>{" "}
                  ({summaryStats.percentageOfAll.toFixed(1)}% of all spending)
                </p>
                <p className="text-sm text-muted-foreground">
                  Transaction count:{" "}
                  <span className="font-medium text-foreground">
                    {summaryStats.totalTransactions}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={filterOption} onValueChange={setFilterOption}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Total amount</SelectItem>
                  <SelectItem value="transactions">
                    Transaction count
                  </SelectItem>
                  <SelectItem value="average">Average transaction</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={range.toString()}
                onValueChange={(e: string) => setRange(parseInt(e))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Show" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Top 3</SelectItem>
                  <SelectItem value="5">Top 5</SelectItem>
                  <SelectItem value="10">Top 10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-full flex items-center">
            <div className="h-[275px] w-full mt-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={grouped}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 5,
                    bottom: 0,
                    left: 10,
                  }}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    opacity={0.3}
                  />
                  <XAxis
                    type="number"
                    dataKey={getDataKey()}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatAxisValue}
                    domain={[0, "dataMax"]}
                    tick={{
                      fill: resolvedTheme === "dark" ? "#ffffff" : "#000000",
                      fontSize: 12,
                      opacity: 0.65,
                    }}
                  />
                  <YAxis
                    dataKey="merchant_name"
                    type="category"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    width={75}
                    tick={{
                      fill: resolvedTheme === "dark" ? "#ffffff" : "#000000",
                      fontSize: 12,
                      opacity: 0.65,
                    }}
                  />
                  <ChartTooltip
                    cursor={{
                      fill: "var(--muted)",
                      opacity: 0.2,
                    }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid gap-2">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {data.merchant_name}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm text-muted-foreground">
                                Total Amount:
                              </span>
                              <span className="font-bold tabular-nums">
                                {formatCurrency(data.total_amount.toString())}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm text-muted-foreground">
                                % of Selection:
                              </span>
                              <span className="font-bold tabular-nums">
                                {data.percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm text-muted-foreground">
                                Transactions:
                              </span>
                              <span className="font-bold tabular-nums">
                                {data.transaction_count}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm text-muted-foreground">
                                Average:
                              </span>
                              <span className="font-bold tabular-nums">
                                {formatCurrency(
                                  data.average_transaction.toString()
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey={getDataKey()}
                    fill={currentColor}
                    radius={[0, 4, 4, 0]}
                    animationDuration={500}
                    label={{
                      position: "right",
                      formatter: (value: number) => formatValue(value),
                      className: "text-xs tabular-nums",
                      dx: 5,
                      style: {
                        fill: resolvedTheme === "dark" ? "#ffffff" : "#000000",
                      },
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

BarChartTopMerchant.displayName = "BarChartTopMerchant";

export default BarChartTopMerchant;
