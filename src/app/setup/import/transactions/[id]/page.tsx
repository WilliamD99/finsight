import React from "react";
import TransactionsImportPageClient from "./client";
import { createClient } from "@/utils/supabase/server";
import { fetchInstitutionByID } from "@/utils/plaid/utils";

export default async function TransactionsImportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const record = await supabase
    .from("Access Token Table")
    .select("item_id")
    .eq("id", id)
    .single();
  let institutionId = record.data?.item_id;
  if (!institutionId) return <></>;

  let institutionData = await fetchInstitutionByID(institutionId);

  return (
    <>
      <TransactionsImportPageClient
        name={institutionData?.name}
        id={id}
        item_id={institutionId}
      />
    </>
  );
}
