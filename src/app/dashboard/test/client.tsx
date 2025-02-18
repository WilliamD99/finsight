"use client";

import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PlaidLinkOnSuccessMetadata, usePlaidLink } from "react-plaid-link";

export default function TestPageClient({ user }: { user: User }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const institution_id = searchParams.get("id");

  const [linkToken, setLinkToken] = useState<string | null>(null);

  // The link token will be used to exchange for an access token
  const { data, isLoading: linkTokenLoading } = useQuery({
    queryKey: ["plaid-token", user.id],
    queryFn: async () => {
      try {
        const res = await fetch("/api/plaid/create-link-token/update", {
          method: "POST",
          body: JSON.stringify({ client_user_id: user.id, institution_id }),
        });
        let data = await res.json();
        console.log(data);
        return data.link_token || "";
      } catch (e) {
        console.error(e);
        return "";
      }
    },
  });

  const { open, ready, exit } = usePlaidLink({
    token: linkToken!,
    onSuccess: async (
      public_token: string,
      metadata: PlaidLinkOnSuccessMetadata
    ) => {
      try {
        let res = await fetch("/api/plaid/exchange-token", {
          method: "POST",
          body: JSON.stringify({
            public_token: public_token,
            user_id: user.id,
            institution_id: metadata.institution?.institution_id,
          }),
        });
        let data = await res.json();
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    },
    onExit: () => {
      // If user exits Plaid Link, redirect to dashboard
      router.push("/dashboard");
    },
  });

  useEffect(() => {
    if (data) {
      setLinkToken(data);
    }
  }, [data]);

  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready]);

  return <div>TestPageClient</div>;
}
