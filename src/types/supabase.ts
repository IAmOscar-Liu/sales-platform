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
      announcements: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          message: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          message?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          message?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          assigned_salesman: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          region: string | null
        }
        Insert: {
          address?: string | null
          assigned_salesman?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          region?: string | null
        }
        Update: {
          address?: string | null
          assigned_salesman?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          region?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_assigned_salesman_fkey"
            columns: ["assigned_salesman"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          delivery_date: string | null
          id: string
          notes: string | null
          order_id: string | null
          status: string | null
        }
        Insert: {
          delivery_date?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          status?: string | null
        }
        Update: {
          delivery_date?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          subtotal: number | null
          unit_price: number
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          subtotal?: number | null
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          subtotal?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          salesman_id: string | null
          status: string | null
          total: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          salesman_id?: string | null
          status?: string | null
          total?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          salesman_id?: string | null
          status?: string | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_salesman_id_fkey"
            columns: ["salesman_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          sku: string | null
          stock: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          sku?: string | null
          stock?: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          sku?: string | null
          stock?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          birthday: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          phone_code: string | null
          region: string | null
          role: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          phone_code?: string | null
          region?: string | null
          role?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          phone_code?: string | null
          region?: string | null
          role?: string
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
  public: {
    Enums: {},
  },
} as const
