"use client";
import { useUserAccount } from "@/hooks/use-userAccount";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { PlaidLinkOnSuccessMetadata, usePlaidLink } from "react-plaid-link";

type LinkUpdateContextType = {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  institution_id: string;
  setInstitutionId: (institution_id: string) => void;
};

const LinkUpdateContext = createContext<LinkUpdateContextType | undefined>(
  undefined
);

export default function LinkUpdate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [institution_id, setInstitutionId] = useState("");
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const { data: user } = useUserAccount();
  const router = useRouter();
  // The link token will be used to exchange for an access token
  const { data, isLoading: linkTokenLoading } = useQuery({
    queryKey: ["plaid-token", user?.user?.id],
    queryFn: async () => {
      try {
        const res = await fetch("/api/plaid/create-link-token/update", {
          method: "POST",
          body: JSON.stringify({
            client_user_id: user?.user?.id,
            institution_id,
          }),
        });

        let data = await res.json();
        console.log(data);
        return data.link_token || "";
      } catch (e) {
        console.error(e);
        return "";
      }
    },
    enabled: !!user?.user?.id && !!institution_id && openModal, // Only fetch if the modal is open, and there is an institution id
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
            user_id: user?.user?.id,
            institution_id: metadata.institution?.institution_id,
          }),
        });
        let data = await res.json();
        console.log(data);

        // Replace the old access token with the new one
      } catch (e) {
        console.log(e);
      }
    },
    onExit: () => {
      // If user exits Plaid Link, redirect to dashboard
      // router.refresh();
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

  return (
    <LinkUpdateContext.Provider
      value={{ openModal, setOpenModal, institution_id, setInstitutionId }}
    >
      {/* An overlay to prevent the user from interacting with the page when the modal is open */}
      {openModal && (
        <div
          style={{ zIndex: 9999 }}
          className="fixed inset-0 bg-black bg-opacity-50 pointer-events-auto animate-fadeIn"
        />
      )}
      <div className={openModal ? "pointer-events-none" : ""}>{children}</div>
    </LinkUpdateContext.Provider>
  );
}

export function useLinkUpdate() {
  const context = useContext(LinkUpdateContext);
  if (!context) {
    throw new Error("useLinkUpdate must be used within a LinkUpdateProvider");
  }
  return context;
}
