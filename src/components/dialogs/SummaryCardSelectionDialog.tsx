import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getInactiveCards } from "@/utils/dexie/utils/summaryCard";

export default function SummaryCardSelectionDialog({
  children,
  open,
  setOpen,
  action,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: (e: string) => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["inactive-cards"],
    queryFn: async () => {
      let result = await getInactiveCards();
      return result;
    },
    enabled: open,
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace the card</DialogTitle>
            <DialogDescription>
              Choose a card to replace this card with.
            </DialogDescription>
          </DialogHeader>
          <div>
            {data &&
              data.map((e) => (
                <p onClick={() => action(e.id)} key={e.title}>
                  {e.title}
                </p>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
