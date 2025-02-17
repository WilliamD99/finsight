"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-btn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { verifyOtpFormSchema, VerifyOtpFormSchema } from "@/utils/form/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function VerifyLoginPageClient({ email }: { email: string }) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<VerifyOtpFormSchema>({
    resolver: zodResolver(verifyOtpFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const verifyAction = async (formData: FormData) => {
    const supabase = createClient();

    let code = formData.get("code") as string;

    let { error } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: "email",
    });
    if (!error) {
      router.push("/dashboard");
    } else {
      toast({
        title: `Error code: ${error.code}`,
        description: error.message,
      });
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 w-[500px] md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={"flex flex-col gap-6"}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form className="col-span-2 p-6 md:p-8" action={verifyAction}>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col items-center text-center space-y-1">
                      <h1 className="text-2xl font-bold">Verify Login</h1>
                      <p className="text-balance text-xs text-muted-foreground">
                        Enter the code sent to your inbox to continue login.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                id="code"
                                placeholder="Enter your OTP code"
                                required
                                type="text"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <SubmitButton className="w-full">Verify</SubmitButton>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
