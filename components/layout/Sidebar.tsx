"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, ListTodo, Calendar, Timer, BarChart3, Library, Settings } from "lucide-react";

// Routes moved inside component for translation

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Download, Upload, LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudyStore } from "@/lib/store";


export function Sidebar() {
    const pathname = usePathname();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const importData = useStudyStore((state) => state.importData);
    const profile = useStudyStore((state) => state.profile);

    const handleExport = () => {
        const state = useStudyStore.getState();
        const data = {
            courses: state.courses,
            tasks: state.tasks,
            profile: state.profile,
            studySessions: state.studySessions,
            timer: state.timer
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `studysync-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Data exported successfully");
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                importData(json);
                toast.success("Data imported successfully");
            } catch (error) {
                console.error("Import failed", error);
                toast.error("Failed to import data. Invalid JSON.");
            }
        };
        reader.readAsText(file);
        // Reset input
        event.target.value = '';
    };

    const { t } = useLanguage();

    const translatedRoutes = [
        { label: t.sidebar.dashboard, icon: LayoutDashboard, href: "/dashboard", color: "text-sky-500" },
        { label: t.sidebar.courses, icon: BookOpen, href: "/courses", color: "text-emerald-500" },
        { label: t.sidebar.tasks, icon: ListTodo, href: "/tasks", color: "text-violet-500" },
        { label: t.sidebar.calendar, icon: Calendar, href: "/calendar", color: "text-orange-500" },
        { label: t.sidebar.flashcards, icon: Library, href: "/flashcards", color: "text-amber-500" },
        { label: t.sidebar.focusMode, icon: Timer, href: "/focus", color: "text-pink-700" },
        { label: t.sidebar.analytics, icon: BarChart3, href: "/analytics", color: "text-blue-500" },
        { label: t.sidebar.settings, icon: Settings, href: "/settings", color: "text-slate-500" },
    ];

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border-r">
            <div className="px-3 py-2 flex-1 overflow-y-auto">
                <Link href="/dashboard" className="flex items-center pl-3 mb-8 mt-4">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        {t.common.appName}
                    </h1>
                </Link>

                {/* Gamification Stats */}
                <div className="mx-3 mb-6 p-3 bg-white dark:bg-slate-800/50 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.common.level} {profile.level}</span>
                        <span className="text-xs font-bold text-amber-500">🔥 {profile.streak} {t.common.days}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${(profile.xp % 1000) / 10}%` }}
                        />
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground text-right">{profile.xp % 1000} / 1000 {t.common.xp}</div>
                </div>

                <div className="space-y-1">
                    {translatedRoutes.map((route) => (
                        <Link key={route.href} href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition",
                                pathname === route.href ? "bg-slate-200 dark:bg-slate-800 text-primary" : "text-slate-500"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-3 py-2 border-t">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-500"
                        onClick={handleExport}
                    >
                        <Download className="h-5 w-5 mr-3 text-gray-500" />
                        {t.common.export}
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-500"
                        onClick={handleImportClick}
                    >
                        <Upload className="h-5 w-5 mr-3 text-gray-500" />
                        {t.common.import}
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".json"
                        onChange={handleImportFile}
                    />
                    {profile.role === 'admin' && (
                        <Link href="/admin">
                            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 mb-2">
                                <ShieldAlert className="h-5 w-5 mr-3" />
                                Admin Console
                            </Button>
                        </Link>
                    )}
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                    <LogoutButton />
                </div>
            </div>
        </div >
    );
}

function LogoutButton() {
    const { t } = useLanguage();
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
            onClick={handleLogout}
            disabled={loading}
        >
            <LogOut className="h-5 w-5 mr-3" />
            {loading ? "Logging out..." : "Log Out"}
        </Button>
    )
}
