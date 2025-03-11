import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tables } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";

interface BankAccountSelectProps {
  accounts: Tables<"Accounts">[];
  selectedAccount: string | null;
  onAccountChange: (accountId: string | null) => void;
  isLoading?: boolean;
}

export default function BankAccountSelect({
  accounts,
  selectedAccount,
  onAccountChange,
  isLoading = false,
}: BankAccountSelectProps) {
  return (
    <Select
      value={selectedAccount || "all"}
      onValueChange={(value) => onAccountChange(value === "all" ? null : value)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select an account" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Bank Accounts</SelectLabel>
          <SelectItem value="all">All Accounts</SelectItem>
          {isLoading ? (
            <div className="flex flex-col space-y-2 px-2 py-1.5">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            accounts.map((account) => (
              <SelectItem key={account.id} value={account.account_id}>
                {account.name} ({account.type})
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
