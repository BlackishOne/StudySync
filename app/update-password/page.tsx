"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap } from "lucide-react";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Check if user has a valid session from the reset link
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push('/login');
            }
        });
    }, [supabase.auth, router]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Password updated successfully, redirect to login
            router.push('/login?message=Password updated successfully');
        }
    };

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2 font-sans">
            {/* Left Side: Form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative">
                <div className="mx-auto grid w-full max-w-[400px] gap-8">
                    <div className="flex flex-col space-y-3 text-center">
                        <div className="flex justify-center mb-6 lg:hidden">
                            <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                <GraduationCap className="h-8 w-8" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Update password</h1>
                        <p className="text-muted-foreground text-base">
                            Enter your new password below
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleUpdatePassword} className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter new password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="py-6 bg-muted/30 focus:bg-background transition-colors"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="py-6 bg-muted/30 focus:bg-background transition-colors"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full py-6 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update password"}
                            </Button>
                        </form>
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
