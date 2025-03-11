"use client";
import React, { useState } from "react";
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
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function SetupAccountDialog({
  user,
  profile,
  onSuccess, // Use this props to specify what to do after submit the form
}: {
  user: User;
  profile?: Tables<"User Profile"> | null;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isReady, setReady] = useState<boolean>(() => !!profile);

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
    let message = await setupAccountAction(
      profile ? "update" : "insert",
      formData
    );
    if (message.status === 201 || message.status === 200) {
      if (onSuccess) onSuccess();
      toast({
        title: message.message,
        duration: 1500,
        variant: "success",
      });
      setReady(true);

      // After success insert or update profile
      // Set the localStorage for easy access
      localStorage.setItem(
        `user_profile`,
        JSON.stringify({
          email: formData.get("email") as string,
          first_name: formData.get("first_name") as string,
          last_name: formData.get("last_name") as string,
          phone: formData.get("phone") as string,
        })
      );

      // Invalidate the profile query
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
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
            <div className="pt-2 w-full flex flex-row items-center justify-between ">
              <SubmitButton>{profile ? "Update" : "Create"}</SubmitButton>
              <Button
                disabled={!isReady}
                type="button"
                onClick={() => router.push("/setup/bank")}
              >
                Connect Bank
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
