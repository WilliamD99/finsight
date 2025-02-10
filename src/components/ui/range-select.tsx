"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export default function RangeSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRange = searchParams.get("range") || "30";

  const rangeOptions = [
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    // { value: 'custom', label: 'custom' }
  ];

  const handleUpdateDateRange = (selectedDateRange: string) => {
    // Create a new URLSearchParams object
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    // Set the new category
    current.set("range", selectedDateRange);
    // Convert to string
    const search = current.toString();
    // Create new URL with updated params
    const query = search ? `?${search}` : "";
    // Push the new URL
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <Select defaultValue={initialRange} onValueChange={handleUpdateDateRange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="30 days" />
      </SelectTrigger>
      <SelectContent>
        {rangeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
