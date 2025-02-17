import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {} satisfies ChartConfig;

function groupTransactionsByCategory(transactions: Tables<"Transactions">[]): {
  category: string;
  total_amount: number;
  transaction_count: number;
}[] {
  const grouped = new Map<
    string,
    { total_amount: number; transaction_count: number }
  >();

  for (const { category_2, amount } of transactions) {
    if (!category_2 || amount === undefined || amount! < 0) continue;

    const entry = grouped.get(category_2) || {
      total_amount: 0,
      transaction_count: 0,
    };
    entry.total_amount += amount!;
    entry.transaction_count += 1;
    grouped.set(category_2, entry);
  }

  return Array.from(grouped.entries())
    .map(([category, { total_amount, transaction_count }]) => ({
      category,
      total_amount,
      transaction_count,
    }))
    .sort((a, b) => b.total_amount - a.total_amount);
}
const RADIAN = Math.PI / 180;

const getRandomColor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) * 17 + ((hash << 5) - hash);
  }
  return `hsl(${((hash % 360) + 360) % 360}, 70%, 50%)`; // Ensure positive hue values
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={"middle"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChartSpendingDistribution({
  data,
}: {
  data: Tables<"Transactions">[] | [];
}) {
  const grouped = useMemo(() => {
    return groupTransactionsByCategory(data).map((entry) => ({
      ...entry,
      color: getRandomColor(entry.category),
    }));
  }, [data]);

  const totalSpend = useMemo(() => {
    return grouped.reduce((acc, curr) => acc + curr.total_amount, 0);
  }, [grouped]);

  return (
    <Card id="spending-distribution" className="shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle className="flex flex-row items-center justify-between">
          <p>Spending Distribution</p>
        </CardTitle>
        <CardDescription>
          Showing proportions of total spending across categories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, key) => {
                    return (
                      <div className="flex flex-row space-x-2">
                        <p className="capitalize font-medium">
                          {key.toString()}:
                        </p>
                        <p>${Number(value).toFixed(2)}</p>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie
              data={grouped}
              dataKey="total_amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {grouped.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          ${totalSpend.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total spend
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
