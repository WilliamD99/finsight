export interface BankAccount {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  mask?: string;
  institution_id: string;
  balance?: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
} 