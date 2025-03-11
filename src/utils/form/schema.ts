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

// Schema for verify OTP form
export const verifyOtpFormSchema = z.object({
  code: z.string(),
});

export type VerifyOtpFormSchema = z.infer<typeof verifyOtpFormSchema>;

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

// Schema for Account Import form - allows importing multiple accounts at once
export const accountImportFormSchema = z.object({
  accounts: z.array(
    z.object({
      id: z.string(),
      item_id: z.string(),
      name: z.string(),
      type: z.string(),
      subtype: z.string(),
      mask: z.string().optional(),
      balance: z.number().optional(),
      currency: z.string().optional(),
    })
  ),
});

export type AccountImportFormSchema = z.infer<typeof accountImportFormSchema>;

// Schema for Transaction Import form
export const transactionImportFormSchema = z.object({
  id: z.string(),
  range: z.union([
    z.string(),
    z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }),
  ]),
  item_id: z.string(),
});

export type TransactionImportFormSchema = z.infer<
  typeof transactionImportFormSchema
>;

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

// Schema for Financial Health Indicator settings
export const financialHealthIndicatorSettingsSchema = z.object({
  debtToIncomeThreshold: z.number().min(0).max(100),
  savingsRateThreshold: z.number().min(0).max(100),
  essentialRatioThreshold: z.number().min(0).max(100),
  essentialCategories: z.array(z.enum(PLAID_CATEGORIES)),
});

export type FinancialHealthIndicatorSettingsSchema = z.infer<
  typeof financialHealthIndicatorSettingsSchema
>;
