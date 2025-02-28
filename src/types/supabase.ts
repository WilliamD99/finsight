export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      "Access Token Table": {
        Row: {
          id: string
          item_id: string | null
          token: string
          user_id: string | null
        }
        Insert: {
          id?: string
          item_id?: string | null
          token: string
          user_id?: string | null
        }
        Update: {
          id?: string
          item_id?: string | null
          token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Access Token Table_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "Institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      Accounts: {
        Row: {
          account_id: string
          balances: Json | null
          id: string
          ins_id: string | null
          mask: string | null
          name: string | null
          official_name: string | null
          subtype: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          account_id: string
          balances?: Json | null
          id?: string
          ins_id?: string | null
          mask?: string | null
          name?: string | null
          official_name?: string | null
          subtype?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          account_id?: string
          balances?: Json | null
          id?: string
          ins_id?: string | null
          mask?: string | null
          name?: string | null
          official_name?: string | null
          subtype?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Accounts_ins_id_fkey"
            columns: ["ins_id"]
            isOneToOne: false
            referencedRelation: "Institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      "App Settings": {
        Row: {
          dashboard: Json | null
          id: string
          theme: string | null
        }
        Insert: {
          dashboard?: Json | null
          id?: string
          theme?: string | null
        }
        Update: {
          dashboard?: Json | null
          id?: string
          theme?: string | null
        }
        Relationships: []
      }
      Institutions: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      Transactions: {
        Row: {
          access_id: string | null
          account_id: string | null
          amount: number | null
          category: string[] | null
          category_2: string | null
          date: string | null
          iso_currency_code: string | null
          logo_url: string | null
          merchant_name: string | null
          name: string | null
          payment_channel: string | null
          transaction_id: string
          user_id: string | null
        }
        Insert: {
          access_id?: string | null
          account_id?: string | null
          amount?: number | null
          category?: string[] | null
          category_2?: string | null
          date?: string | null
          iso_currency_code?: string | null
          logo_url?: string | null
          merchant_name?: string | null
          name?: string | null
          payment_channel?: string | null
          transaction_id: string
          user_id?: string | null
        }
        Update: {
          access_id?: string | null
          account_id?: string | null
          amount?: number | null
          category?: string[] | null
          category_2?: string | null
          date?: string | null
          iso_currency_code?: string | null
          logo_url?: string | null
          merchant_name?: string | null
          name?: string | null
          payment_channel?: string | null
          transaction_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Transactions_access_id_fkey"
            columns: ["access_id"]
            isOneToOne: false
            referencedRelation: "Institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      "User Profile": {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
