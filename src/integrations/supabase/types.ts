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
          arv: string | null
          asking_price: string | null
          bathrooms: string | null
          bedrooms: string | null
          business_hours: string | null
          city: string
          closing_date: string | null
          closing_occupancy: string | null
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
          financing_types: string[] | null
          foundation_type: string | null
          front_photo: string | null
          garage: string | null
          generated_titles: string[] | null
          gross_profit: string | null
          hook: string | null
          html_content: string | null
          id: string
          include_financial_breakdown: boolean | null
          lot_size: string | null
          office_number: string | null
          photo_link: string | null
          pool: string | null
          post_possession: string | null
          rehab_estimate: string | null
          selected_title: string | null
          square_footage: string | null
          updated_at: string
          utilities: string | null
          website: string | null
          year_built: string | null
          zoning: string | null
        }
        Insert: {
          additional_disclosures?: string | null
          address: string
          address_slug: string
          all_in?: string | null
          arv?: string | null
          asking_price?: string | null
          bathrooms?: string | null
          bedrooms?: string | null
          business_hours?: string | null
          city: string
          closing_date?: string | null
          closing_occupancy?: string | null
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
          financing_types?: string[] | null
          foundation_type?: string | null
          front_photo?: string | null
          garage?: string | null
          generated_titles?: string[] | null
          gross_profit?: string | null
          hook?: string | null
          html_content?: string | null
          id?: string
          include_financial_breakdown?: boolean | null
          lot_size?: string | null
          office_number?: string | null
          photo_link?: string | null
          pool?: string | null
          post_possession?: string | null
          rehab_estimate?: string | null
          selected_title?: string | null
          square_footage?: string | null
          updated_at?: string
          utilities?: string | null
          website?: string | null
          year_built?: string | null
          zoning?: string | null
        }
        Update: {
          additional_disclosures?: string | null
          address?: string
          address_slug?: string
          all_in?: string | null
          arv?: string | null
          asking_price?: string | null
          bathrooms?: string | null
          bedrooms?: string | null
          business_hours?: string | null
          city?: string
          closing_date?: string | null
          closing_occupancy?: string | null
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
          financing_types?: string[] | null
          foundation_type?: string | null
          front_photo?: string | null
          garage?: string | null
          generated_titles?: string[] | null
          gross_profit?: string | null
          hook?: string | null
          html_content?: string | null
          id?: string
          include_financial_breakdown?: boolean | null
          lot_size?: string | null
          office_number?: string | null
          photo_link?: string | null
          pool?: string | null
          post_possession?: string | null
          rehab_estimate?: string | null
          selected_title?: string | null
          square_footage?: string | null
          updated_at?: string
          utilities?: string | null
          website?: string | null
          year_built?: string | null
          zoning?: string | null
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
