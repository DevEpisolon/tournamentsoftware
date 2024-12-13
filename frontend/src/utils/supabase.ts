import {createClient, SupabaseClient} from "@supabase/supabase-js";


export const supabase = createClient(
  'https://zfdiyoffxsyhiwxxhrgn.supabase.co/',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZGl5b2ZmeHN5aGl3eHhocmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMzkwNTMsImV4cCI6MjA0OTYxNTA1M30._TX-cvlLS-R77HMbGFRQJE9mFbi3fNq-sidt_frI2vs'
)