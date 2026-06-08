import { createClient } from "@supabase/supabase-js";

// Chaves PÚBLICAS (anon) — feitas para ficar no frontend.
// A segurança dos dados é garantida pelo RLS do Supabase (ver docs/supabase.sql):
// participantes só podem INSERIR/ATUALIZAR; leitura é exclusiva do admin autenticado.
const SUPABASE_URL = "https://qzhcauoldxzgapzifuoi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6aGNhdW9sZHh6Z2FwemlmdW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDg4NTksImV4cCI6MjA5NjQ4NDg1OX0.dLSHkbXZ3Re56H3PTuG-aBgCtELqrwX-Cjrvl89SHs0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
