import React from "react";
import TransactionsImportPageClient from "./client";
import { createClient } from "@/utils/supabase/server";
import { fetchInstitutionByID } from "@/utils/plaid/utils";
import { redirect } from "next/navigation";
import { getUserData } from "@/utils/server-utils/actions";

export default async function TransactionsImportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id: institutionId } = await params;
  const data = await getUserData();

  const record = await supabase
    .from("Access Token Table")
    .select("id")
    .eq("user_id", data!.id)
    .eq("item_id", institutionId)
    .single();
  console.log(record);
  if (!institutionId || !record) redirect("/error");

  let institutionData = await fetchInstitutionByID(institutionId);
  let recordId = record.data!.id;

  return (
    <>
      <TransactionsImportPageClient
        name={institutionData?.name ?? ""}
        id={recordId}
        item_id={institutionId}
      />
    </>
  );
}
