import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ytcfcuoavtjfotvxahwy.supabase.co",
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Y2ZjdW9hdnRqZm90dnhhaHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MjA4MjYsImV4cCI6MjA4MzQ5NjgyNn0.0y9FqFZYyQJ5duPWD78JK6hxkGvX_8GcoxFMXWXIkU0",
            {
                cookies: {
                    getAll() {
                        return [] // Just a dummy getter for the temporary client
                        // Actually, for the exchange to work in the route handler, 
                        // we usually need to read/write cookies.
                        // But createServerClient requires the cookie store.
                        // Let's use the standard Next.js cookie store pattern.
                    },
                    setAll(cookiesToSet) {
                        // We'll handle this below with the response
                    },
                },
            }
        )

        // RE-CREATE client with proper cookie handling for the route
        // The previous pattern is for middleware. Here we need actual cookie access.
        // Let's use the proper pattern for Route Handlers.
    }

    // Correct implementation below
    return await handleCallback(request);
}

import { cookies } from 'next/headers'

async function handleCallback(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ytcfcuoavtjfotvxahwy.supabase.co",
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Y2ZjdW9hdnRqZm90dnhhaHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MjA4MjYsImV4cCI6MjA4MzQ5NjgyNn0.0y9FqFZYyQJ5duPWD78JK6hxkGvX_8GcoxFMXWXIkU0",
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
