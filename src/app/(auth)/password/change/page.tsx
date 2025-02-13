"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { passwordChangeForm, PasswordChangeForm } from "@/utils/form/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-btn";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

export default function PasswordChangePage() {
  const [pwShow, setPwShow] = useState<Boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const [session, setSession] = useState<Session | null>(null);

  const form = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeForm),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (formData: PasswordChangeForm) => {
    if (!session) {
      return;
    }
    const password = formData.password;
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({
        title: `Error code: ${error.name}`,
        description: error.message,
        duration: 2000,
      });
    } else {
      toast({
        title: "Password change successfully",
        description: "You will be redirected to the homepage soon.",
        duration: 1500,
      });
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
      }
    }
    getSession();
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 w-[1000px] md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={"flex flex-col gap-6"}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form
                  className="p-6 md:p-8"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">
                        Change your password
                      </h1>
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  id="password"
                                  placeholder="Enter your new password"
                                  required
                                  type={pwShow ? "text" : "password"}
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() => setPwShow(!pwShow)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2"
                                >
                                  {pwShow ? (
                                    <EyeIcon className="h-4 w-4" />
                                  ) : (
                                    <EyeSlashIcon className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="confirm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                              <div className="relative space-y-2">
                                <Input
                                  id="confirm"
                                  placeholder="Re-enter your password."
                                  required
                                  type={pwShow ? "text" : "password"}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <SubmitButton className="w-full">Submit</SubmitButton>
                  </div>
                </form>
              </Form>
              <div className="relative hidden bg-muted md:block"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
