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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      assessment_schedule: {
        Row: {
          created_at: string
          id: string
          initial_assessment_date: string
          initial_assessment_id: string
          next_full_assessment_date: string
          next_pulse_date: string
          pulse_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          initial_assessment_date: string
          initial_assessment_id: string
          next_full_assessment_date: string
          next_pulse_date: string
          pulse_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          initial_assessment_date?: string
          initial_assessment_id?: string
          next_full_assessment_date?: string
          next_pulse_date?: string
          pulse_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          answers: Json
          date: string
          demographics: Json | null
          dimension_scores: Json
          email: string | null
          historical_profile_id: string | null
          id: string
          organization_id: string | null
          overall_score: number
          user_id: string | null
        }
        Insert: {
          answers: Json
          date?: string
          demographics?: Json | null
          dimension_scores: Json
          email?: string | null
          historical_profile_id?: string | null
          id?: string
          organization_id?: string | null
          overall_score: number
          user_id?: string | null
        }
        Update: {
          answers?: Json
          date?: string
          demographics?: Json | null
          dimension_scores?: Json
          email?: string | null
          historical_profile_id?: string | null
          id?: string
          organization_id?: string | null
          overall_score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_historical_profile_id_fkey"
            columns: ["historical_profile_id"]
            isOneToOne: false
            referencedRelation: "historical_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_relationships: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          is_active: boolean
          participant_id: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          participant_id: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          participant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaching_relationships_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_relationships_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          completed_dates: Json
          created_at: string
          description: string
          dimension: string
          frequency: string
          id: string
          user_id: string
        }
        Insert: {
          completed_dates?: Json
          created_at?: string
          description: string
          dimension: string
          frequency?: string
          id?: string
          user_id: string
        }
        Update: {
          completed_dates?: Json
          created_at?: string
          description?: string
          dimension?: string
          frequency?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      historical_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_historical: boolean
          name: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          source_unique_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_historical?: boolean
          name?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          source_unique_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_historical?: boolean
          name?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          source_unique_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "historical_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string | null
          organization_id: string | null
          recipient_id: string | null
          sender_role: string | null
          user_id: string
          username: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type?: string | null
          organization_id?: string | null
          recipient_id?: string | null
          sender_role?: string | null
          user_id: string
          username: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string | null
          organization_id?: string | null
          recipient_id?: string | null
          sender_role?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          scheduled_for: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          scheduled_for?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          scheduled_for?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_code_uses: {
        Row: {
          created_at: string
          id: string
          promo_code_id: string
          trial_end_date: string
          trial_start_date: string
          used_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          promo_code_id: string
          trial_end_date: string
          trial_start_date?: string
          used_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          promo_code_id?: string
          trial_end_date?: string
          trial_start_date?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_uses_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          current_uses: number
          expires_at: string | null
          id: string
          max_uses: number | null
          trial_days: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          current_uses?: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          trial_days?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          current_uses?: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          trial_days?: number
        }
        Relationships: []
      }
      pulse_tests: {
        Row: {
          answers: Json
          created_at: string
          date: string
          dimension_scores: Json
          id: string
          original_assessment_id: string
          overall_score: number
          questions_selected: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          answers: Json
          created_at?: string
          date?: string
          dimension_scores: Json
          id?: string
          original_assessment_id: string
          overall_score: number
          questions_selected: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          date?: string
          dimension_scores?: Json
          id?: string
          original_assessment_id?: string
          overall_score?: number
          questions_selected?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_activities: {
        Row: {
          activity_id: string
          completed: boolean
          created_at: string
          dimension: string
          id: string
          saved_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_id: string
          completed?: boolean
          created_at?: string
          dimension: string
          id?: string
          saved_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          completed?: boolean
          created_at?: string
          dimension?: string
          id?: string
          saved_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      associate_existing_participants_with_coach: {
        Args: { coach_email: string }
        Returns: number
      }
      create_organization_secure: {
        Args: { org_description?: string; org_name: string }
        Returns: string
      }
      create_payment_secure: {
        Args: {
          p_amount: number
          p_status?: string
          p_stripe_session_id: string
          p_user_id: string
        }
        Returns: string
      }
      get_aggregate_scores: {
        Args: Record<PropertyKey, never>
        Returns: {
          average_score: number
          company_size_scores: Json
          dimension: string
          gender_scores: Json
          management_level_scores: Json
          role_scores: Json
        }[]
      }
      get_assessment_summary: {
        Args: { assessment_id: string }
        Returns: {
          date: string
          demographics: Json
          dimension_scores: Json
          historical_profile_id: string
          id: string
          organization_id: string
          overall_score: number
          user_id: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_organization_assessments: {
        Args: { org_id: string }
        Returns: {
          answers: Json
          date: string
          demographics: Json | null
          dimension_scores: Json
          email: string | null
          historical_profile_id: string | null
          id: string
          organization_id: string | null
          overall_score: number
          user_id: string | null
        }[]
      }
      get_paginated_assessments: {
        Args: {
          organization_filter?: string
          page_limit?: number
          page_offset?: number
        }
        Returns: {
          answers: Json
          date: string
          demographics: Json
          dimension_scores: Json
          email: string
          historical_profile_id: string
          id: string
          organization_id: string
          overall_score: number
          total_count: number
          user_id: string
        }[]
      }
      get_paginated_users: {
        Args: {
          page_limit?: number
          page_offset?: number
          role_filter?: Database["public"]["Enums"]["user_role"]
          search_term?: string
        }
        Returns: {
          created_at: string
          email: string
          id: string
          is_historical: boolean
          name: string
          organization_id: string
          organization_name: string
          role: Database["public"]["Enums"]["user_role"]
          source_unique_id: string
          total_count: number
        }[]
      }
      get_secure_paginated_assessments: {
        Args: {
          organization_filter?: string
          page_limit?: number
          page_offset?: number
        }
        Returns: {
          answers: Json
          date: string
          demographics: Json
          dimension_scores: Json
          email: string
          historical_profile_id: string
          id: string
          organization_id: string
          overall_score: number
          total_count: number
          user_id: string
        }[]
      }
      get_user_assessments_secure: {
        Args: { is_historical_user?: boolean; target_user_id: string }
        Returns: {
          answers: Json
          date: string
          demographics: Json
          dimension_scores: Json
          email: string
          historical_profile_id: string
          id: string
          overall_score: number
          user_id: string
        }[]
      }
      get_user_profile_secure: {
        Args: { profile_user_id?: string }
        Returns: {
          created_at: string
          email: string
          id: string
          name: string
          organization_id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }[]
      }
      is_authenticated_user: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_service_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      promote_user_to_admin: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      update_payment_status_secure: {
        Args: { p_status: string; p_stripe_session_id: string }
        Returns: boolean
      }
      validate_assessment_answers: {
        Args: { answers: Json }
        Returns: boolean
      }
      validate_promo_code: {
        Args: { code_input: string }
        Returns: {
          code: string
          id: string
          is_valid: boolean
          message: string
          trial_days: number
        }[]
      }
      validate_promo_code_secure: {
        Args: { code_input: string }
        Returns: {
          code: string
          id: string
          is_valid: boolean
          message: string
          trial_days: number
        }[]
      }
    }
    Enums: {
      user_role: "user" | "admin" | "super_admin" | "coach"
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
    Enums: {
      user_role: ["user", "admin", "super_admin", "coach"],
    },
  },
} as const
