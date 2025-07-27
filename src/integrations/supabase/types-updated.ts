export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assessments: {
        Row: {
          answers: Json
          date: string
          demographics: Json | null
          dimension_scores: Json
          email: string | null
          id: string
          organization_id: string | null
          overall_score: number
          user_id: string
        }
        Insert: {
          answers: Json
          date?: string
          demographics?: Json | null
          dimension_scores: Json
          email?: string | null
          id?: string
          organization_id?: string | null
          overall_score: number
          user_id: string
        }
        Update: {
          answers?: Json
          date?: string
          demographics?: Json | null
          dimension_scores?: Json
          email?: string | null
          id?: string
          organization_id?: string | null
          overall_score?: number
          user_id?: string
        }
        Relationships: [
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
      coaching_notes: {
        Row: {
          assessment_id: string | null
          coach_id: string
          created_at: string
          id: string
          is_private: boolean
          note: string
          participant_id: string
          updated_at: string
        }
        Insert: {
          assessment_id?: string | null
          coach_id: string
          created_at?: string
          id?: string
          is_private?: boolean
          note: string
          participant_id: string
          updated_at?: string
        }
        Update: {
          assessment_id?: string | null
          coach_id?: string
          created_at?: string
          id?: string
          is_private?: boolean
          note?: string
          participant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaching_notes_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_notes_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_notes_participant_id_fkey"
            columns: ["participant_id"]
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
          organization_id: string | null
          participant_id: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          organization_id?: string | null
          participant_id: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          organization_id?: string | null
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
            foreignKeyName: "coaching_relationships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      data_access_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_access_logs_user_id_fkey"
            columns: ["user_id"]
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
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
          username: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
          username: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
          username?: string
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
        Relationships: []
      }
      saved_activities: {
        Row: {
          activity_data: Json
          completed: boolean
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_data: Json
          completed?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_data?: Json
          completed?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      get_organization_assessments: {
        Args: { org_id: string }
        Returns: {
          answers: Json
          date: string
          demographics: Json | null
          dimension_scores: Json
          email: string | null
          id: string
          organization_id: string | null
          overall_score: number
          user_id: string
        }[]
      }
    }
    Enums: {
      user_role: "user" | "admin" | "coach"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}