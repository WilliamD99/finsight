import React, { useState } from "react";
import { BarChart, Bar, YAxis, XAxis, Label, LabelList } from "recharts";
import { ChartConfig, ChartContainer } from "../ui/chart";

const data = [
  {
    category: "Page A",
    uv: 4000,
  },
  {
    category: "Page B",
    uv: 3000,
  },
  {
    category: "Page C",
    uv: 2000,
  },
  {
    category: "Page D",
    uv: 2780,
  },
  {
    category: "Page E",
    uv: 1890,
  },
  {
    category: "Page F",
    uv: 2390,
  },
  {
    category: "Page G",
    uv: 3490,
  },
];

const chartConfig = {
  uv: {
    label: "income",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function BarChartComponent() {
  return (
    <>
      <div>
        <p className="font-bold text-lg">Income vs Expenses</p>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] h-[350px]"
        >
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            barSize={50}
          >
            <Bar dataKey="uv" fill="#8884d8">
              <LabelList
                dataKey="uv"
                position={"top"}
                formatter={(e: string) => `$${e}`}
              />
            </Bar>
            <XAxis dataKey="category" />
            <YAxis tickFormatter={(value) => `$${value}`} />
          </BarChart>
        </ChartContainer>
      </div>
    </>
  );
}
