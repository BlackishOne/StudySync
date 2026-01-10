"use client";

import { useStudyStore } from "@/lib/store";
import { useStore } from "@/hooks/use-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function TasksSummaryWidget() {
    const { t } = useLanguage();
    const tasks = useStore(useStudyStore, (state) => state.tasks);

    if (!tasks) return <Card><CardContent className="pt-6">{t.dashboard.loading}</CardContent></Card>;

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const pending = total - completed;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.dashboard.activeTasks}</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{pending}</div>
                <p className="text-xs text-muted-foreground">
                    {completed} {t.dashboard.completedTasks}
                </p>
            </CardContent>
        </Card>
    );
}
