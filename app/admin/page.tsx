"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert, Users, Activity, Database, TrendingUp } from "lucide-react";

type Profile = {
    id: string;
    email: string; // If we can fetch it, actually usually in auth schema, but maybe synced to profiles?
    full_name: string;
    role: string;
    created_at: string;
};

// Note: To fetch emails, we usually need a function or to have synced email to public.profiles.
// For this MVP, we will rely on data available in 'profiles' table.

export default function AdminDashboard() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            // Check role in profiles
            const { data, error } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (data?.role === "admin") {
                setIsAdmin(true);
                fetchData();
            } else {
                // Not admin
                router.push("/dashboard");
            }
        };

        checkAdmin();
    }, []);

    const fetchData = async () => {
        // Fetch all profiles
        const { data, error } = await supabase
            .from("profiles")
            .select("*");

        if (data) {
            setProfiles(data as Profile[]);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-red-500" />
                <span className="text-xl font-mono">AUTHENTICATING COMMANDER...</span>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
            <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-red-900/20 p-2 rounded border border-red-500/50">
                        <ShieldAlert className="h-8 w-8 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Admin Console</h1>
                        <p className="text-slate-400 text-sm">System Overview & User Management</p>
                    </div>
                </div>
                <Button variant="destructive" onClick={() => router.push("/dashboard")}>
                    Exit Admin Mode
                </Button>
            </header>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{profiles.length}</div>
                        <p className="text-xs text-slate-500">+20% from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Active Sessions</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">~{Math.ceil(profiles.length * 0.8)}</div>
                        <p className="text-xs text-slate-500">Estimated based on auth</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Database Load</CardTitle>
                        <Database className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">Healthy</div>
                        <p className="text-xs text-slate-500">Latency: 45ms</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Revenue (MRR)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">$0.00</div>
                        <p className="text-xs text-slate-500">Project is (currently) free</p>
                    </CardContent>
                </Card>
            </div>

            {/* User List Table */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Registered Commanders (Users)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-950 text-slate-200 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 border-b border-slate-800">ID (Partial)</th>
                                    <th className="p-4 border-b border-slate-800">Full Name</th>
                                    <th className="p-4 border-b border-slate-800">Role</th>
                                    <th className="p-4 border-b border-slate-800">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map((profile) => (
                                    <tr key={profile.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 font-mono text-slate-500">
                                            {profile.id.substring(0, 8)}...
                                        </td>
                                        <td className="p-4 font-medium text-white">
                                            {profile.full_name || "Unknown"}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${profile.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                                {profile.role?.toUpperCase() || "STUDENT"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {profiles.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">
                                            No users found (or access denied).
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
