"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import CalendarSelector from "../dialogs/CalendarSelector";
import { DateRange } from "react-day-picker";

function parseRangeParam(param: string): string {
  // If it's one of the known presets, just return it
  if (["30", "60", "90"].includes(param)) {
    return param;
  }

  // Otherwise, try to parse JSON
  try {
    const obj = JSON.parse(param);
    // Check minimal shape for custom range
    if (obj && typeof obj === "object" && "from" in obj && "to" in obj) {
      return "Custom";
    }
    // Fallback if the object doesn't match
    return "30";
  } catch (error) {
    // If JSON parse fails, fallback to "30"
    return "30";
  }
}

export default function RangeSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Safely decode the param or default to "30"
  const param = searchParams.get("range");
  const safeParam = param ? decodeURIComponent(param) : "30";

  const [rangeState, setRangeState] = useState<string>(() =>
    parseRangeParam(safeParam)
  );
  const rangeOptions = [
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    { value: "Custom", label: "custom" },
  ];

  const handleUpdateDateRange = (selectedDateRange: string) => {
    setRangeState(selectedDateRange);
    if (selectedDateRange !== "Custom") {
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
    } else {
    }
  };

  const handleSelectCustomRange = (date: DateRange) => {
    const encoded = encodeURIComponent(JSON.stringify(date));
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("range", encoded);
    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <div className="flex flex-row items-center space-x-2">
      <Select value={rangeState} onValueChange={handleUpdateDateRange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue className="capitalize" placeholder="30 days" />
        </SelectTrigger>
        <SelectContent>
          {rangeOptions.map((option) => (
            <SelectItem
              className="capitalize"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {rangeState === "Custom" && (
        <CalendarSelector
          initial={JSON.parse(safeParam)}
          onSelect={handleSelectCustomRange}
          openState={true}
        />
      )}
    </div>
  );
}
