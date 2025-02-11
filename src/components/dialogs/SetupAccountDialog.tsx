"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import {
  accountSetupFormSchema,
  AccountSetupFormSchema,
} from "@/utils/form/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { setupAccountAction } from "@/utils/form/actions/setupAccountAction";
import { Tables } from "@/types/supabase";
import { SubmitButton } from "../ui/submit-btn";

export default function SetupAccountDialog({
  user,
  profile,
  type = "insert",
  onSuccess, // Use this props to specify what to do after submit the form
}: {
  user: User;
  profile?: Tables<"User Profile"> | null;
  type: "insert" | "update";
  onSuccess?: () => void;
}) {
  const form = useForm<AccountSetupFormSchema>({
    resolver: zodResolver(accountSetupFormSchema),
    defaultValues: {
      email: user.email ?? "",
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      phone: 1,
    },
  });

  const action = async (formData: FormData) => {
    let message = await setupAccountAction(type, formData);

    if (message.status === 201) {
      if (onSuccess) onSuccess();
    }
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Account Information</AlertDialogTitle>
          <AlertDialogDescription>
            Let's help you setup. We just need some basic information for your
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form className="space-y-2" action={action}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-200 text-gray-500 cursor-not-allowed focus:ring-0 focus:outline-none"
                      readOnly
                      placeholder="Your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <SubmitButton className="mt-2">Submit</SubmitButton>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
