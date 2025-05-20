import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vggwhpplgaemfxehakka.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ3docHBsZ2FlbWZ4ZWhha2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjM0ODYsImV4cCI6MjA2Mjk5OTQ4Nn0.7xuZhoTS07Iz_a7dSzHu0UTj-17B7x3tY8zRkf7eHvg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
