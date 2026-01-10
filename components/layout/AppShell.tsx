"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicRoute = pathname === "/" || pathname === "/login" || pathname === "/register";

    if (isPublicRoute) {
        return <div className="h-full">{children}</div>;
    }

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
                <Sidebar />
            </div>
            <main className="md:pl-72 h-full">
                <div className="h-16 border-b fixed inset-x-0 top-0 md:left-72 z-30 bg-background text-foreground">
                    <Topbar />
                </div>
                <div className="pt-16 h-full p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
