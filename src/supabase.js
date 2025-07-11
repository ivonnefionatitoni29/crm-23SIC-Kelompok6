import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zztgauvpwenthbmepuyu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dGdhdXZwd2VudGhibWVwdXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzgwMTUsImV4cCI6MjA2NTk1NDAxNX0.cpLwMIY0SfZ_yzvNGg1uzmzGTPlxA0Saq4Pm1e5Srnc'
export const supabase = createClient(supabaseUrl, supabaseKey)    