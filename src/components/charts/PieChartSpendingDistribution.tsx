"use client";
import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/data";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {} satisfies ChartConfig;

function groupTransactionsByCategory(transactions: Tables<"Transactions">[]): {
  category: string;
  total_amount: number;
  transaction_count: number;
  percentage: number;
}[] {
  const grouped = new Map<
    string,
    { total_amount: number; transaction_count: number }
  >();

  let totalAmount = 0;
  for (const { category_2, amount } of transactions) {
    if (!category_2 || amount === undefined || amount! < 0) continue;

    const entry = grouped.get(category_2) || {
      total_amount: 0,
      transaction_count: 0,
    };
    entry.total_amount += amount!;
    entry.transaction_count += 1;
    totalAmount += amount!;
    grouped.set(category_2, entry);
  }

  return Array.from(grouped.entries())
    .map(([category, { total_amount, transaction_count }]) => ({
      category,
      total_amount,
      transaction_count,
      percentage: (total_amount / totalAmount) * 100,
    }))
    .sort((a, b) => b.total_amount - a.total_amount);
}

const RADIAN = Math.PI / 180;

const getChartColors = (theme: string | undefined) => ({
  colors: [
    { light: "hsl(142, 76%, 36%)", dark: "hsl(142, 76%, 46%)" }, // Green
    { light: "hsl(221, 83%, 53%)", dark: "hsl(217, 91%, 60%)" }, // Blue
    { light: "hsl(292, 76%, 36%)", dark: "hsl(292, 76%, 46%)" }, // Purple
    { light: "hsl(31, 76%, 36%)", dark: "hsl(31, 76%, 46%)" }, // Orange
    { light: "hsl(0, 76%, 36%)", dark: "hsl(0, 76%, 46%)" }, // Red
    { light: "hsl(182, 76%, 36%)", dark: "hsl(182, 76%, 46%)" }, // Cyan
    { light: "hsl(262, 76%, 36%)", dark: "hsl(262, 76%, 46%)" }, // Indigo
    { light: "hsl(322, 76%, 36%)", dark: "hsl(322, 76%, 46%)" }, // Pink
    { light: "hsl(92, 76%, 36%)", dark: "hsl(92, 76%, 46%)" }, // Lime
    { light: "hsl(152, 76%, 36%)", dark: "hsl(152, 76%, 46%)" }, // Teal
  ],
});

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="var(--background)"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export default function PieChartSpendingDistribution({
  data,
}: {
  data: Tables<"Transactions">[] | [];
}) {
  const { theme } = useTheme();
  const [displayCount, setDisplayCount] = useState<number>(5);
  const chartColors = getChartColors(theme);

  const grouped = useMemo(() => {
    const allCategories = groupTransactionsByCategory(data);
    const topCategories = allCategories.slice(0, displayCount);

    return topCategories.map((entry, index) => ({
      ...entry,
      color:
        chartColors.colors[index % chartColors.colors.length][
          theme as "light" | "dark"
        ] || chartColors.colors[0][theme as "light" | "dark"],
    }));
  }, [data, displayCount, theme, chartColors]);

  const totalSpend = useMemo(() => {
    return grouped.reduce((acc, curr) => acc + curr.total_amount, 0);
  }, [grouped]);

  const totalTransactions = useMemo(() => {
    return grouped.reduce((acc, curr) => acc + curr.transaction_count, 0);
  }, [grouped]);

  return (
    <Card id="spending-distribution" className="shadow-none">
      <CardHeader className="pb-0">
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Spending Distribution</CardTitle>
            <CardDescription>
              Top spending categories by total amount
            </CardDescription>
          </div>
          <Select
            value={displayCount.toString()}
            onValueChange={(e: string) => setDisplayCount(parseInt(e))}
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
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Spend</p>
            <p className="text-2xl font-bold tabular-nums">
              {formatCurrency(totalSpend.toString())}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold tabular-nums">
              {totalTransactions}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-start space-x-4">
          <div className="flex-1">
            <ChartContainer
              config={chartConfig}
              className="h-[275px] [&_.recharts-pie-label-text]:fill-foreground"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid gap-2">
                            <div className="flex flex-col">
                              <span className="font-medium capitalize">
                                {data.category}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm text-muted-foreground">
                                Amount:
                              </span>
                              <span className="font-bold tabular-nums">
                                {formatCurrency(data.total_amount.toString())}
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
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Pie
                    data={grouped}
                    dataKey="total_amount"
                    nameKey="category"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    strokeWidth={2}
                    stroke="var(--background)"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {grouped.map((entry) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
