export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      properties: {
        Row: {
          additional_disclosures: string | null
          address: string
          address_slug: string
          all_in: string | null
          apn: string | null
          arv: string | null
          asking_price: string | null
          bathrooms: string | null
          bedrooms: string | null
          big_ticket_items: Json | null
          business_hours: string | null
          buy_hold_cash_to_seller: string | null
          buy_hold_monthly_insurance: string | null
          buy_hold_monthly_rent: string | null
          buy_hold_monthly_taxes: string | null
          buy_hold_mortgage_payment: string | null
          buy_hold_other_expenses: string | null
          buy_hold_purchase_price: string | null
          buy_hold_rehab_cost: string | null
          buy_hold_type: string | null
          city: string
          closing_date: string | null
          closing_date_type: string | null
          closing_occupancy: string | null
          company_logo: string | null
          comps: Json | null
          contact_email: string | null
          contact_image: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          current_occupancy: string | null
          deal_type: string
          emd_amount: string | null
          emd_due_date: string | null
          exit_strategy: string | null
          financing_other: string | null
          financing_types: string[] | null
          foundation_type: string | null
          front_photo: string | null
          generated_titles: string[] | null
          gross_profit: string | null
          hook: string | null
          html_content: string | null
          id: string
          include_buy_hold_snapshot: boolean | null
          include_financial_breakdown: boolean | null
          include_one_percent_rule: boolean | null
          is_land: boolean | null
          is_premarket: boolean | null
          land_condition: string | null
          lot_size: string | null
          lot_size_unit: string | null
          office_number: string | null
          parking_spaces: string | null
          parking_type: string | null
          photo_link: string | null
          pool: boolean | null
          pool_type: string | null
          post_possession: string | null
          rehab_estimate: string | null
          road_frontage: string | null
          road_frontage_unit: string | null
          selected_title: string | null
          square_footage: string | null
          state: string | null
          updated_at: string
          user_id: string | null
          utilities: Json | null
          utilities_other: string | null
          website: string | null
          year_built: string | null
          zip: string | null
          zoning: string | null
        }
        Insert: {
          additional_disclosures?: string | null
          address: string
          address_slug: string
          all_in?: string | null
          apn?: string | null
          arv?: string | null
          asking_price?: string | null
          bathrooms?: string | null
          bedrooms?: string | null
          big_ticket_items?: Json | null
          business_hours?: string | null
          buy_hold_cash_to_seller?: string | null
          buy_hold_monthly_insurance?: string | null
          buy_hold_monthly_rent?: string | null
          buy_hold_monthly_taxes?: string | null
          buy_hold_mortgage_payment?: string | null
          buy_hold_other_expenses?: string | null
          buy_hold_purchase_price?: string | null
          buy_hold_rehab_cost?: string | null
          buy_hold_type?: string | null
          city: string
          closing_date?: string | null
          closing_date_type?: string | null
          closing_occupancy?: string | null
          company_logo?: string | null
          comps?: Json | null
          contact_email?: string | null
          contact_image?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          current_occupancy?: string | null
          deal_type: string
          emd_amount?: string | null
          emd_due_date?: string | null
          exit_strategy?: string | null
          financing_other?: string | null
          financing_types?: string[] | null
          foundation_type?: string | null
          front_photo?: string | null
          generated_titles?: string[] | null
          gross_profit?: string | null
          hook?: string | null
          html_content?: string | null
          id?: string
          include_buy_hold_snapshot?: boolean | null
          include_financial_breakdown?: boolean | null
          include_one_percent_rule?: boolean | null
          is_land?: boolean | null
          is_premarket?: boolean | null
          land_condition?: string | null
          lot_size?: string | null
          lot_size_unit?: string | null
          office_number?: string | null
          parking_spaces?: string | null
          parking_type?: string | null
          photo_link?: string | null
          pool?: boolean | null
          pool_type?: string | null
          post_possession?: string | null
          rehab_estimate?: string | null
          road_frontage?: string | null
          road_frontage_unit?: string | null
          selected_title?: string | null
          square_footage?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string | null
          utilities?: Json | null
          utilities_other?: string | null
          website?: string | null
          year_built?: string | null
          zip?: string | null
          zoning?: string | null
        }
        Update: {
          additional_disclosures?: string | null
          address?: string
          address_slug?: string
          all_in?: string | null
          apn?: string | null
          arv?: string | null
          asking_price?: string | null
          bathrooms?: string | null
          bedrooms?: string | null
          big_ticket_items?: Json | null
          business_hours?: string | null
          buy_hold_cash_to_seller?: string | null
          buy_hold_monthly_insurance?: string | null
          buy_hold_monthly_rent?: string | null
          buy_hold_monthly_taxes?: string | null
          buy_hold_mortgage_payment?: string | null
          buy_hold_other_expenses?: string | null
          buy_hold_purchase_price?: string | null
          buy_hold_rehab_cost?: string | null
          buy_hold_type?: string | null
          city?: string
          closing_date?: string | null
          closing_date_type?: string | null
          closing_occupancy?: string | null
          company_logo?: string | null
          comps?: Json | null
          contact_email?: string | null
          contact_image?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          current_occupancy?: string | null
          deal_type?: string
          emd_amount?: string | null
          emd_due_date?: string | null
          exit_strategy?: string | null
          financing_other?: string | null
          financing_types?: string[] | null
          foundation_type?: string | null
          front_photo?: string | null
          generated_titles?: string[] | null
          gross_profit?: string | null
          hook?: string | null
          html_content?: string | null
          id?: string
          include_buy_hold_snapshot?: boolean | null
          include_financial_breakdown?: boolean | null
          include_one_percent_rule?: boolean | null
          is_land?: boolean | null
          is_premarket?: boolean | null
          land_condition?: string | null
          lot_size?: string | null
          lot_size_unit?: string | null
          office_number?: string | null
          parking_spaces?: string | null
          parking_type?: string | null
          photo_link?: string | null
          pool?: boolean | null
          pool_type?: string | null
          post_possession?: string | null
          rehab_estimate?: string | null
          road_frontage?: string | null
          road_frontage_unit?: string | null
          selected_title?: string | null
          square_footage?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string | null
          utilities?: Json | null
          utilities_other?: string | null
          website?: string | null
          year_built?: string | null
          zip?: string | null
          zoning?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          business_hours: Json | null
          company_logo: string | null
          contact_email: string | null
          contact_image: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          office_number: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          business_hours?: Json | null
          company_logo?: string | null
          contact_email?: string | null
          contact_image?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          office_number?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          business_hours?: Json | null
          company_logo?: string | null
          contact_email?: string | null
          contact_image?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          office_number?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_property_contact_info: {
        Args: { property_address: string }
        Returns: {
          business_hours: string
          contact_email: string
          contact_image: string
          contact_name: string
          contact_phone: string
          office_number: string
          website: string
        }[]
      }
      get_public_property_data: {
        Args: { property_address: string }
        Returns: {
          additional_disclosures: string
          address: string
          address_slug: string
          all_in: string
          apn: string
          arv: string
          asking_price: string
          bathrooms: string
          bedrooms: string
          big_ticket_items: Json
          buy_hold_cash_to_seller: string
          buy_hold_monthly_insurance: string
          buy_hold_monthly_rent: string
          buy_hold_monthly_taxes: string
          buy_hold_mortgage_payment: string
          buy_hold_other_expenses: string
          buy_hold_purchase_price: string
          buy_hold_rehab_cost: string
          buy_hold_type: string
          city: string
          closing_date: string
          closing_date_type: string
          closing_occupancy: string
          comps: Json
          created_at: string
          current_occupancy: string
          deal_type: string
          emd_amount: string
          emd_due_date: string
          exit_strategy: string
          financing_other: string
          financing_types: string[]
          foundation_type: string
          front_photo: string
          generated_titles: string[]
          gross_profit: string
          hook: string
          html_content: string
          id: string
          include_buy_hold_snapshot: boolean
          include_financial_breakdown: boolean
          include_one_percent_rule: boolean
          is_land: boolean
          is_premarket: boolean
          land_condition: string
          lot_size: string
          lot_size_unit: string
          parking_spaces: string
          parking_type: string
          photo_link: string
          pool: boolean
          pool_type: string
          post_possession: string
          rehab_estimate: string
          road_frontage: string
          road_frontage_unit: string
          selected_title: string
          square_footage: string
          state: string
          updated_at: string
          utilities: Json
          utilities_other: string
          year_built: string
          zip: string
          zoning: string
        }[]
      }
      secure_upsert_property: {
        Args: { property_data: Json }
        Returns: {
          address: string
          address_slug: string
          city: string
          created_at: string
          deal_type: string
          html_content: string
          id: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
