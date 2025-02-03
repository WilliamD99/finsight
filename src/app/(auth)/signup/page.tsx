"use client";

import { signup } from "./action";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/ui/submit-btn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { signupFormSchema, SignUpFormSchema } from "@/utils/form/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [pwShow, setPwShow] = useState<Boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  const pwRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
    },
  });

  const signupAction = async (formData: FormData) => {
    let res = await signup(formData);

    if (res.status !== 201) {
      toast({
        title: `Oops, something went wrong (code: ${res.status})`,
        description: res.message,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (password && passwordConfirm !== password) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  }, [passwordConfirm, password]);

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center p-6 w-[1000px] md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <div className={"flex flex-col gap-6"}>
            <Card className="overflow-hidden">
              <CardContent className="grid p-0 md:grid-cols-2">
                <Form {...form}>
                  <form className="p-6 md:p-8" action={signupAction}>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-bold">Welcome aboard</h1>
                        <p className="text-balance text-muted-foreground">
                          Create your account here
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
                                <Input
                                  id="email"
                                  placeholder="Enter your email"
                                  required
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel>Password</FormLabel>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    id="password"
                                    name="password"
                                    type={pwShow ? "text" : "password"}
                                    placeholder="Enter your password"
                                    required
                                    ref={pwRef}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setPassword(e.target.value);
                                    }}
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
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel>Confirm Password</FormLabel>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    id="confirm"
                                    name="confirm"
                                    type={pwShow ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    required
                                    ref={pwRef}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setPasswordConfirm(e.target.value);
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setPwShow(!pwShow)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                  ></button>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {!passwordsMatch && passwordConfirm && (
                          <p className="text-xs text-red-400 italic">
                            Password does not matched!
                          </p>
                        )}
                      </div>
                      <SubmitButton className="w-full">Sign Up</SubmitButton>
                    </div>
                  </form>
                </Form>
                <div className="relative hidden bg-muted md:block">
                  {/* <img
                    src="/placeholder.svg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  /> */}
                </div>
              </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
              By clicking continue, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
