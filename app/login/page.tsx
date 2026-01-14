"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { GraduationCap, Quote } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2 font-sans">
            {/* Left Side: Form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative">
                {/* Back Button (Optional) */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8">
                    <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        ← Back
                    </Link>
                </div>

                <div className="mx-auto grid w-full max-w-[400px] gap-8">
                    <div className="flex flex-col space-y-3 text-center">
                        <div className="flex justify-center mb-6 lg:hidden">
                            <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                <GraduationCap className="h-8 w-8" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground text-base">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button variant="outline" type="button" onClick={handleGoogleLogin} disabled={loading} className="py-6 text-base font-medium relative hover:bg-muted/50 transition-colors">
                            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-wider">
                                <span className="bg-background px-4 text-muted-foreground">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="py-6 bg-muted/30 focus:bg-background transition-colors"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/reset-password"
                                        className="ml-auto inline-block text-sm font-medium text-primary hover:underline transition-all"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="py-6 bg-muted/30 focus:bg-background transition-colors"
                                />
                            </div>
                            <Button type="submit" className="w-full py-6 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" disabled={loading}>
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </div>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="underline font-semibold text-primary hover:text-primary/80 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side: Image/Branding */}
            <div className="hidden bg-slate-950 lg:flex lg:flex-col lg:items-center lg:justify-center relative overflow-hidden h-full">
                <Image
                    src="/auth-bg.png"
                    alt="Authentication Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-950/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-center text-white max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl mb-8">
                        <GraduationCap className="h-16 w-16 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">StudySync</h2>
                    <p className="text-slate-300 mt-4 text-lg">
                        Your academic journey, organized.
                    </p>
                </div>
            </div>
        </div>
    );
}

function QuoteClassName() {
    return <Quote className="h-8 w-8 opacity-50" />;
}
