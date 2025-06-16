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
      crypto_analysis: {
        Row: {
          created_at: string | null
          id: string
          market_cap_rank: number | null
          mention_count: number
          sentiment_score: number | null
          token_name: string | null
          token_symbol: string
          trending_rank: number | null
          updated_at: string | null
          volume_rank: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          market_cap_rank?: number | null
          mention_count?: number
          sentiment_score?: number | null
          token_name?: string | null
          token_symbol: string
          trending_rank?: number | null
          updated_at?: string | null
          volume_rank?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          market_cap_rank?: number | null
          mention_count?: number
          sentiment_score?: number | null
          token_name?: string | null
          token_symbol?: string
          trending_rank?: number | null
          updated_at?: string | null
          volume_rank?: number | null
        }
        Relationships: []
      }
      discord_messages2: {
        Row: {
          channel: string
          created_at: string | null
          id: number
          message: string
          server_id: string
          server_name: string
          user_id: string
        }
        Insert: {
          channel: string
          created_at?: string | null
          id?: number
          message: string
          server_id: string
          server_name: string
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string | null
          id?: number
          message?: string
          server_id?: string
          server_name?: string
          user_id?: string
        }
        Relationships: []
      }
      parsed_messages: {
        Row: {
          created_at: string
          id: number
          processed_at: string | null
          text: string
          token: string
          token_name: string
        }
        Insert: {
          created_at: string
          id?: number
          processed_at?: string | null
          text: string
          token: string
          token_name: string
        }
        Update: {
          created_at?: string
          id?: number
          processed_at?: string | null
          text?: string
          token?: string
          token_name?: string
        }
        Relationships: []
      }
      token_dictionary: {
        Row: {
          created_at: string | null
          last_updated: string | null
          market_cap_rank: number | null
          name: string
          symbol: string
          trending_rank: number | null
          volume_rank: number | null
        }
        Insert: {
          created_at?: string | null
          last_updated?: string | null
          market_cap_rank?: number | null
          name: string
          symbol: string
          trending_rank?: number | null
          volume_rank?: number | null
        }
        Update: {
          created_at?: string | null
          last_updated?: string | null
          market_cap_rank?: number | null
          name?: string
          symbol?: string
          trending_rank?: number | null
          volume_rank?: number | null
        }
        Relationships: []
      }
      token_mentions: {
        Row: {
          channel_id: string
          context_window: string
          created_at: string
          id: number
          market_cap_at_mention: number | null
          market_cap_rank: number | null
          message_id: string
          message_text: string
          price_at_mention: number | null
          processed_at: string | null
          token_name: string
          token_symbol: string
          trending_rank: number | null
          user_id: string
          volume_at_mention: number | null
          volume_rank: number | null
        }
        Insert: {
          channel_id: string
          context_window: string
          created_at: string
          id?: number
          market_cap_at_mention?: number | null
          market_cap_rank?: number | null
          message_id: string
          message_text: string
          price_at_mention?: number | null
          processed_at?: string | null
          token_name: string
          token_symbol: string
          trending_rank?: number | null
          user_id: string
          volume_at_mention?: number | null
          volume_rank?: number | null
        }
        Update: {
          channel_id?: string
          context_window?: string
          created_at?: string
          id?: number
          market_cap_at_mention?: number | null
          market_cap_rank?: number | null
          message_id?: string
          message_text?: string
          price_at_mention?: number | null
          processed_at?: string | null
          token_name?: string
          token_symbol?: string
          trending_rank?: number | null
          user_id?: string
          volume_at_mention?: number | null
          volume_rank?: number | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

