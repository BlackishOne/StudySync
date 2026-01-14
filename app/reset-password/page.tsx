"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `https://studysync.ca/update-password`,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2 font-sans">
            {/* Left Side: Form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative">
                {/* Back Button */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8">
                    <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        ← Back to login
                    </Link>
                </div>

                <div className="mx-auto grid w-full max-w-[400px] gap-8">
                    <div className="flex flex-col space-y-3 text-center">
                        <div className="flex justify-center mb-6 lg:hidden">
                            <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                <GraduationCap className="h-8 w-8" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Reset password</h1>
                        <p className="text-muted-foreground text-base">
                            Enter your email address and we&apos;ll send you a link to reset your password
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                    Password reset link sent! Check your email inbox.
                                </AlertDescription>
                            </Alert>
                        )}

                        {!success ? (
                            <form onSubmit={handleResetPassword} className="grid gap-5">
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
                                <Button
                                    type="submit"
                                    className="w-full py-6 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send reset link"}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center">
                                <Link href="/login">
                                    <Button variant="outline" className="w-full py-6">
                                        Return to login
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link href="/login" className="underline font-semibold text-primary hover:text-primary/80 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side: Branding */}
            <div className="hidden bg-slate-950 lg:flex lg:flex-col lg:items-center lg:justify-center relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-950/50 to-transparent" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-center text-white max-w-lg mx-auto">
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
