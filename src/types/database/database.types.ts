/**
 * Database types for Supabase.
 * Placeholder for future Supabase CLI generation.
 * @module types/database/database.types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      carbon_profiles: {
        Row: {
          id: string;
          user_id: string;
          carbon_score: number | null;
          annual_emissions: number | null;
          last_calculated: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          carbon_score?: number | null;
          annual_emissions?: number | null;
          last_calculated?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          carbon_score?: number | null;
          annual_emissions?: number | null;
          last_calculated?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      simulator_runs: {
        Row: {
          id: string;
          user_id: string;
          scenario_name: string | null;
          footprint_before: number | null;
          footprint_after: number | null;
          score_change: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          scenario_name?: string | null;
          footprint_before?: number | null;
          footprint_after?: number | null;
          score_change?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          scenario_name?: string | null;
          footprint_before?: number | null;
          footprint_after?: number | null;
          score_change?: number | null;
          created_at?: string;
        };
      };
      roadmap_progress: {
        Row: {
          id: string;
          user_id: string;
          milestone_key: string;
          completed: boolean;
          progress_percentage: number;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          milestone_key: string;
          completed?: boolean;
          progress_percentage?: number;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          milestone_key?: string;
          completed?: boolean;
          progress_percentage?: number;
          completed_at?: string | null;
        };
      };
      achievements: {
        Row: {
          id: string;
          achievement_key: string;
          title: string;
          description: string | null;
          xp_reward: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          achievement_key: string;
          title: string;
          description?: string | null;
          xp_reward?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          achievement_key?: string;
          title?: string;
          description?: string | null;
          xp_reward?: number;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
      };
      ecojump_scores: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          coins: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score?: number;
          coins?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          score?: number;
          coins?: number;
          created_at?: string;
        };
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
