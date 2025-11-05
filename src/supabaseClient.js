import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tcdrztpekuwrskmztbrl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZHJ6dHBla3V3cnNrbXp0YnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDk0NTQsImV4cCI6MjA3NzkyNTQ1NH0.Uuq51vyl50bPCDI2SR4Dl1HCRSYMrEvzsxaVBDV-rzA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
