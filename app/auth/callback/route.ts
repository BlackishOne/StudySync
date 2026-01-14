import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/update-password'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Redirect to update-password page after successful auth
            return NextResponse.redirect(new URL(next, requestUrl.origin))
        }
    }

    // Return the user to an error page with some instructions
    return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
}
