"use client";

import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
const CashFlow = dynamic(() => import("./card/Cashflow"));
const AccountBalance = dynamic(() => import("./card/AccountBalance"));
const Spending = dynamic(() => import("./card/Spending"));
const TopCategory = dynamic(() => import("./card/TopCategory"));
const TestCard = dynamic(() => import("./card/TestCard"));
const LoadingCard = dynamic(() => import("./card/LoadingCard"));

import { updateCard, useSummaryCard } from "@/utils/dexie/utils/summaryCard";
import SummaryCardSelectionDialog from "../dialogs/SummaryCardSelectionDialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Tables } from "@/types/supabase";

export default function SummaryCards({
  data,
}: {
  data: Tables<"Transactions">[] | [];
}) {
  // Control the open state of dialog
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>();

  const summaryCards = useSummaryCard();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const renderCard = (id: string) => {
    switch (id) {
      case "1":
        return <CashFlow id="1" openDialog={handleOpenDialog} />;
      case "2":
        return <AccountBalance id="2" openDialog={handleOpenDialog} />;
      case "3":
        return <Spending id="3" openDialog={handleOpenDialog} />;
      case "4":
        return <TopCategory id="4" openDialog={handleOpenDialog} />;
      case "5":
        return <TestCard id="5" openDialog={handleOpenDialog} />;
      default:
        return <div>Unknown Card</div>;
    }
  };

  const handleOpenDialog = (id: string) => {
    setOpen(!open);
    if (id) {
      setSelected(id);
    }
  };

  const handleReplaceAction = async (e: string) => {
    try {
      if (selected) {
        // This will update the selected card with a new Card component
        await updateCard(selected, e);
        setOpen(false);
        // // Revalidate the getInactiveCard query
        queryClient.invalidateQueries({ queryKey: ["inactive-cards"] });
      }
    } catch (e) {
      toast({
        title: "Something went wrong, please try again",
        description: "We encouter error when trying to update this.",
        variant: "destructive",
      });
      console.log(e);
    }
  };

  return (
    <SummaryCardSelectionDialog
      open={open}
      setOpen={setOpen}
      action={handleReplaceAction}
    >
      {summaryCards.length > 0 ? (
        summaryCards.map((card) => (
          <div key={card.id}>{renderCard(card.cardId)}</div>
        ))
      ) : (
        <>
          {Array.from({ length: 4 }).map((e, index) => (
            <LoadingCard key={index} />
          ))}
        </>
      )}
    </SummaryCardSelectionDialog>
  );
}
