
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ytcfcuoavtjfotvxahwy.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Y2ZjdW9hdnRqZm90dnhhaHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MjA4MjYsImV4cCI6MjA4MzQ5NjgyNn0.0y9FqFZYyQJ5duPWD78JK6hxkGvX_8GcoxFMXWXIkU0"
    )
}
