"use client";

import { CalendarView } from "@/components/calendar/CalendarView";
import { TimetableGrid } from "@/components/calendar/TimetableGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ... imports
import { useLanguage } from "@/contexts/LanguageContext";

import { useState, useEffect } from "react";

export default function CalendarPage() {
    const { t } = useLanguage();

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">{t.calendar.title}</h2>
            </div>

            <Tabs defaultValue="month" className="flex-1 flex flex-col">
                <TabsList className="w-[200px] mb-4">
                    <TabsTrigger value="month">{t.calendar.monthly}</TabsTrigger>
                    <TabsTrigger value="week">{t.calendar.timetable}</TabsTrigger>
                </TabsList>

                <TabsContent value="month" className="flex-1 border rounded-md p-4 bg-white dark:bg-slate-900">
                    <CalendarView />
                </TabsContent>

                <TabsContent value="week" className="flex-1">
                    <TimetableGrid />
                </TabsContent>
            </Tabs>
        </div>
    )
}
