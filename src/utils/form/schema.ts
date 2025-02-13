import { z } from "zod";

// Schema for account setup
export const accountSetupFormSchema = z.object({
  first_name: z.string({ message: "First name is required" }),
  last_name: z.string({ message: "Last name is required" }),
  email: z.string({ message: "Email is required" }).email(),
  phone: z.coerce.number().optional(),
});

export type AccountSetupFormSchema = z.infer<typeof accountSetupFormSchema>;

// Schema for login form
export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"), // Define the password validation
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

// Schema for signup form
export const signupFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirm: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export type SignUpFormSchema = z.infer<typeof signupFormSchema>;

// Schema for forgot pw form
export const forgotFormSchema = z.object({
  email: z.string().email(),
});

export type ForgotFormSchema = z.infer<typeof forgotFormSchema>;

// Schema for change pw form
export const passwordChangeForm = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export type PasswordChangeForm = z.infer<typeof passwordChangeForm>;

// Schema for Transaction Import form
export const transactionImportFormSchema = z.object({
  id: z.string(),
  range: z.string(),
  item_id: z.string(),
});

export type TransactionImportFormSchema = z.infer<
  typeof transactionImportFormSchema
>;
