"use client";

import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { PlaidLinkOnSuccessMetadata, usePlaidLink } from "react-plaid-link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SetupBankClient({ user }: { user: User }) {
  const { toast } = useToast();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  // The link token will be used to exchange for an access token
  const { data, isLoading: linkTokenLoading } = useQuery({
    queryKey: ["plaid-token", user.id],
    queryFn: async () => {
      try {
        const res = await fetch("/api/plaid/create-link-token", {
          method: "POST",
          body: JSON.stringify({ client_user_id: user.id }),
        });
        let data = await res.json();
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
        queryClient.invalidateQueries({ queryKey: ["institutions"] });
        toast({
          title: "Please wait",
          description: "You're being redirected!",
        });

        router.push(`/setup/import/transactions/${data.id}`);
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

  // Not working
  // useEffect(() => {
  //   console.log(linkTokenLoading);
  //   if (linkTokenLoading) {
  //     toast({
  //       title: "Loading ...",
  //       description: "Please wait while we connect to the bank service",
  //       duration: 3000,
  //     });
  //   }
  // }, [linkTokenLoading]);

  return <></>;
}
