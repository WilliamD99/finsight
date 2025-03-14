"use client";

import React, { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tables } from "@/types/supabase";
import { formatCurrency } from "@/utils/data";

const chartConfig = {
  outflow: {
    color: "hsl(var(--chart-1))",
    label: "Outflow",
  },
  inflow: {
    color: "hsl(var(--chart-2))",
    label: "Inflow",
  },
} satisfies ChartConfig;

interface GroupedTransaction {
  range: string;
  outflow: number;
  inflow: number;
}

function groupTransactionsByDate(
  transactions: Tables<"Transactions">[]
): GroupedTransaction[] {
  const grouped = new Map<string, { outflow: number; inflow: number }>();

  for (const { date, amount } of transactions) {
    if (!date || amount === undefined) continue;
    const formattedDate = date.split("T")[0]; // Extract YYYY-MM-DD

    if (!grouped.has(formattedDate)) {
      grouped.set(formattedDate, { outflow: 0, inflow: 0 });
    }

    const entry = grouped.get(formattedDate)!;
    if (amount! >= 0) {
      entry.outflow += amount!;
    } else {
      entry.inflow += amount!;
    }
  }

  // Convert to sorted array
  return Array.from(grouped.entries())
    .map(([range, { outflow, inflow }]) => ({ range, outflow, inflow }))
    .sort((a, b) => new Date(a.range).getTime() - new Date(b.range).getTime());
}

function aggregateChunks(
  groupedTransactions: GroupedTransaction[],
  days: string
): GroupedTransaction[] {
  let parsedDay = parseInt(days);
  if (parsedDay <= 1) return groupedTransactions; // If parts = 1, return daily aggregation

  const result: GroupedTransaction[] = [];
  let currentChunk: GroupedTransaction | null = null;
  let startDate: Date | null = null;

  for (const transaction of groupedTransactions) {
    const transactionDate = new Date(transaction.range);

    if (
      !currentChunk ||
      !startDate ||
      (transactionDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24) >=
        parsedDay
    ) {
      if (currentChunk) result.push(currentChunk);
      currentChunk = { range: transaction.range, outflow: 0, inflow: 0 };
      startDate = transactionDate;
    }

    currentChunk.outflow += transaction.outflow;
    currentChunk.inflow += transaction.inflow;
  }

  if (currentChunk) result.push(currentChunk); // Push last chunk
  return result;
}

export default function NetFlowChart({
  data,
}: {
  data: Tables<"Transactions">[] | [];
}) {
  const [filterOption, setFilterOption] = useState<string>("1");

  // Memoize computed values to prevent unnecessary renders
  const grouped = useMemo(() => {
    const groupedData = groupTransactionsByDate(data);
    return aggregateChunks(groupedData, filterOption);
  }, [data, filterOption]);

  // Calculate total inflow and outflow
  const totals = useMemo(() => {
    return grouped.reduce(
      (acc, curr) => {
        acc.totalInflow += Math.abs(curr.inflow);
        acc.totalOutflow += curr.outflow;
        return acc;
      },
      { totalInflow: 0, totalOutflow: 0 }
    );
  }, [grouped]);

  return (
    <Card id="netflow" className="shadow-none">
      <CardHeader className="space-y-2">
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Cash Flow Analysis</CardTitle>
            <CardDescription>
              Track your income and spending patterns
            </CardDescription>
          </div>
          <Select
            value={filterOption}
            onValueChange={(e: string) => setFilterOption(e)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Daily view</SelectItem>
              <SelectItem value="7" disabled={data.length < 7}>
                Weekly view
              </SelectItem>
              <SelectItem value="30" disabled={data.length < 30}>
                Monthly view
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Inflow</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500">
              {formatCurrency(totals.totalInflow.toString())}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Outflow</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-500">
              {formatCurrency(totals.totalOutflow.toString())}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart
            data={grouped}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="range"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return filterOption === "1"
                  ? date.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : date.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${Math.abs(value / 1000)}k`}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload) return null;
                const date = new Date(label);
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {date.toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {payload.map((entry, index) => (
                        <div
                          key={`item-${index}`}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: entry.color,
                              }}
                            />
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {entry.name}
                            </span>
                          </div>
                          <span className="font-bold tabular-nums">
                            {formatCurrency(
                              Math.abs(Number(entry.value) || 0).toString()
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="outflow"
              fill="var(--color-outflow)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="inflow"
              fill="var(--color-inflow)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
