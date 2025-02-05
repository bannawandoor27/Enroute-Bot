import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wlskxaqijtxnpbswzrki.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsc2t4YXFpanR4bnBic3d6cmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MzMxNDUsImV4cCI6MjA1NDMwOTE0NX0.JY0vXT95e4TxsvceNLlk9ACWVcbqbBO-p_KilQy8NeA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)