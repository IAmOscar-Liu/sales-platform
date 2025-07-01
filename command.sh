supabase gen types typescript --project-id qispojbqukgkcmuecxfi > src/types/supabase.ts

supabase init
supabase link --project-ref qispojbqukgkcmuecxfi

supabase db pull
supabase db diff --linked