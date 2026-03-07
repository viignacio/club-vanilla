export type OrderStatus = "pending" | "done";

export interface Table {
  id: string;
  name: string;
  secret_key: string;
  created_at: string;
}

export interface Order {
  id: string;
  table_id: string;
  session_id: string;
  status: OrderStatus;
  note: string | null;
  total: number;
  created_at: string;
  updated_at: string;
  // Joined
  table?: Pick<Table, "id" | "name">;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_key: string;
  item_name_en: string;
  item_name_ja: string | null;
  price: number;
  quantity: number;
}

// Cart types (client-side only, not persisted)
export interface CartItem {
  item_key: string;
  item_name_en: string;
  item_name_ja: string | null;
  price: number;
  quantity: number;
}

// Raw DB row types (no joined fields) — used for the typed Supabase client
interface TableRow {
  id: string;
  name: string;
  secret_key: string;
  created_at: string;
}

interface OrderRow {
  id: string;
  table_id: string;
  session_id: string;
  status: OrderStatus;
  note: string | null;
  total: number;
  created_at: string;
  updated_at: string;
}

// Supabase Database type for the typed client
export interface Database {
  public: {
    Tables: {
      tables: {
        Row: TableRow;
        Insert: Omit<TableRow, "id" | "created_at">;
        Update: Partial<Omit<TableRow, "id" | "created_at">>;
      };
      orders: {
        Row: OrderRow;
        Insert: Omit<OrderRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<OrderRow, "id" | "created_at" | "updated_at">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id">;
        Update: Partial<Omit<OrderItem, "id" | "order_id">>;
      };
    };
  };
}

// Order session cookie payload (signed, httpOnly)
export interface OrderSession {
  tableId: string;
  tableName: string;
  sessionId: string; // random UUID per device
  expiresAt: number; // unix timestamp ms
}
