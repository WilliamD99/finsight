import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/utils/lib/utils";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

/**
 * Rendered a calendar picker.
 *
 * @param onSelect (optional) - a callback function that execute after select date
 * @param openState (optional) - control the open state of the calendar pop up
 * @param initial (optional) - default selection of the date picker
 */
export default function CalendarSelector({
  onSelect,
  openState = false,
  initial = {
    from: addDays(new Date(), -7),
    to: new Date(),
  },
}: {
  onSelect?: (date: DateRange) => void;
  openState?: boolean;
  initial?: {
    from: Date;
    to: Date;
  };
}) {
  const [open, setOpen] = useState<boolean>(openState);
  const [date, setDate] = useState<DateRange | undefined>(initial);

  const handleSelect = () => {
    if (onSelect) {
      if (date) {
        onSelect(date);
      }
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setDate({
      from: addDays(new Date(), -7),
      to: new Date(),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          type="button"
        >
          <CalendarIcon />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto p-0" closeIcon={false}>
        <DialogTitle hidden />
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          className="px-7 pt-8"
        />
        <div className="py-2 px-5 flex flex-row items-center justify-end space-x-2">
          <Button className="w-20" onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="w-20" onClick={handleSelect}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
