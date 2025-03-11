import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  financialHealthIndicatorSettingsSchema,
  FinancialHealthIndicatorSettingsSchema,
} from "@/utils/form/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SubmitButton } from "../ui/submit-btn";
import { updateFinancialHealthSettings } from "@/utils/form/actions/updateSettingsAction";
import { useToast } from "@/hooks/use-toast";
import db from "@/utils/dexie";

const PLAID_CATEGORIES = [
  "LOAN_PAYMENT",
  "RENT_AND_UTILITIES",
  "MEDICAL",
  "TRANSPORTATION",
  "FOOD_AND_DRINK",
  "GENERAL_MERCHANDISE",
  "HOME_IMPROVEMENT",
  "ENTERTAINMENT",
  "PERSONAL_CARE",
  "GENERAL_SERVICES",
  "GOVERNMENT_AND_NON_PROFIT",
  "TRAVEL",
  "BANK_FEES",
] as const;

type PlaidCategory = (typeof PLAID_CATEGORIES)[number];

interface FinancialHealthSettingsModalProps {
  onSettingsChange: (settings: FinancialHealthIndicatorSettingsSchema) => void;
  currentSettings: FinancialHealthIndicatorSettingsSchema;
}

export default function FinancialHealthSettingsModal({
  onSettingsChange,
  currentSettings,
}: FinancialHealthSettingsModalProps) {
  const form = useForm<FinancialHealthIndicatorSettingsSchema>({
    resolver: zodResolver(financialHealthIndicatorSettingsSchema),
    defaultValues: currentSettings,
  });
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: FinancialHealthIndicatorSettingsSchema) {
    try {
      setIsSubmitting(true);
      // Update in Supabase via server action
      const result = await updateFinancialHealthSettings(values);

      if (result.success) {
        // Update local state
        onSettingsChange(values);

        // Update settings in Dexie
        const existingSettings = await db.appSettings.toCollection().first();
        if (existingSettings) {
          await db.appSettings.update(existingSettings.id, {
            dashboard: {
              indicators: values,
            },
          });
        } else {
          await db.appSettings.add({
            id: crypto.randomUUID(),
            theme: "light",
            dashboard: {
              indicators: values,
            },
          });
        }

        toast({
          title: "Settings updated",
          description:
            "Your financial health settings have been saved successfully.",
          variant: "success",
          duration: 1500,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
        duration: 1500,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Financial Health Settings</DialogTitle>
          <DialogDescription className="text-xs">
            Adjust the thresholds for financial health indicators
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 -mt-2"
          >
            <FormField
              control={form.control}
              name="debtToIncomeThreshold"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 gap-x-5">
                  <div className="flex flex-col space-y-2 col-span-2 mt-2">
                    <FormLabel>Debt-to-Income Threshold (%)</FormLabel>
                    <FormDescription className="text-xs italic">
                      For example, if your monthly essential expenses are $3,000
                      and income is $6,000, your ratio would be 50%.
                    </FormDescription>
                  </div>
                  <FormControl className="self-start">
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="savingsRateThreshold"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 gap-x-5">
                  <div className="flex flex-col space-y-2 col-span-2 mt-2">
                    <FormLabel>Savings Rate Threshold (%)</FormLabel>
                    <FormDescription className="text-xs">
                      For example, if your monthly income is $6,000 and you save
                      $1,200, your savings rate would be 20%.
                    </FormDescription>
                  </div>
                  <FormControl className="self-start">
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="essentialRatioThreshold"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 gap-x-5">
                  <div className="flex flex-col space-y-2 col-span-2 mt-2">
                    <FormLabel>Essential Expenses Threshold (%)</FormLabel>
                    <FormDescription className="text-xs">
                      For example, if your monthly essential expenses are $3,000
                      and income is $6,000, your ratio would be 50%.
                    </FormDescription>
                  </div>
                  <FormControl className="self-start">
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="essentialCategories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Essential Expense Categories</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value: PlaidCategory) => {
                        const currentValue = field.value || [];
                        if (!currentValue.includes(value)) {
                          field.onChange([...currentValue, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select essential categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLAID_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            disabled={field.value?.includes(category)}
                            className="hover:bg-muted cursor-pointer"
                          >
                            {category.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="text-xs">
                    Select categories to be considered as essential expenses.
                    Click the badge to remove the categories.
                  </FormDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentSettings.essentialCategories?.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs cursor-pointer hover:opacity-80"
                        onClick={() => {
                          field.onChange(
                            currentSettings.essentialCategories?.filter(
                              (c) => c !== category
                            ) || []
                          );
                        }}
                      >
                        {category.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <SubmitButton disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </SubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
