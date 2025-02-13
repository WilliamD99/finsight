"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { forgotFormSchema, ForgotFormSchema } from "@/utils/form/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-btn";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [pwShow, setPwShow] = useState<Boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ForgotFormSchema>({
    resolver: zodResolver(forgotFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const action = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        process.env.NEXT_PUBLIC_REDIRECT_LINK ??
        "http://localhost:3000/password/change",
    });
    if (!error) {
      toast({
        title: "Reset password link sent!",
        description:
          "If there is an account registered with this email, you will receive the link in the mailbox.",
        duration: 2000,
      });
    }
    form.reset();
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 w-[1000px] md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={"flex flex-col gap-6"}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form className="p-6 md:p-8" action={action}>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">
                        Forgot your password?
                      </h1>
                      <p className="text-balance text-muted-foreground">
                        Reset your password now
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative space-y-2">
                                <Input
                                  id="email"
                                  placeholder="Enter your email"
                                  required
                                  type="email"
                                  {...field}
                                />
                                <FormDescription>
                                  We will send you a link to reset your
                                  password. Click on the link and follow
                                  instructions to reset it.
                                </FormDescription>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <SubmitButton className="w-full">Send Link</SubmitButton>

                    <div className="text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/signup"
                        className="underline underline-offset-4"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
              <div className="relative hidden bg-muted md:block"></div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
