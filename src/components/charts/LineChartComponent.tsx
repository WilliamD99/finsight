"use client";
import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "January", income: 186, expenses: 80 },
  { month: "February", income: 305, expenses: 200 },
  { month: "March", income: 237, expenses: 120 },
  { month: "April", income: 73, expenses: 190 },
  { month: "May", income: 209, expenses: 130 },
  { month: "June", income: 214, expenses: 140 },
];

const chartConfig = {
  income: {
    label: "income",
    color: "#2563eb",
  },
  expenses: {
    label: "expenses",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function LineChartComponent() {
  return (
    <div className="">
      <p className="font-bold text-lg">Income vs Expenses</p>
      <ChartContainer config={chartConfig} className="min-h-[200px] h-[350px] ">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line type="monotone" dataKey="income" stroke="#8884d8" />
          <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
