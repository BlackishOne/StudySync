"use client";

import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudyStore } from "@/lib/store";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { TaskType, Task } from "@/lib/types";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const typeColors: Record<TaskType, string> = {
    'EXAM': 'bg-red-500',
    'ASSIGNMENT': 'bg-yellow-500',
    'STUDY_SESSION': 'bg-green-500',
    'OTHER': 'bg-slate-500'
};

// ... imports
import { useLanguage } from "@/contexts/LanguageContext";

// ... typeColors

export function CalendarView() {
    const { t } = useLanguage();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const tasks = useStore(useStudyStore, (state) => state.tasks) || [];

    // ... date logic remains same

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToToday = () => setCurrentMonth(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    // Translate week days dynamically if possible, or mapping.
    // Ideally we use date-fns locale, but manual mapping for now is fine since we only support 2 langs.
    // Or just use t.calendar.weekDays (if I added them). I didn't add day arrays, I added individual days.
    // Let's use hardcoded arrays based on language for now or rely on date-fns locale in future.
    // For now, I'll map them manually.
    const weekDays = [t.calendar.timetableGrid.sunday, t.calendar.timetableGrid.monday, t.calendar.timetableGrid.tuesday, t.calendar.timetableGrid.wednesday, t.calendar.timetableGrid.thursday, t.calendar.timetableGrid.friday, t.calendar.timetableGrid.saturday].map(d => d.substring(0, 3));


    const getTasksForDay = (date: Date) => {
        return tasks.filter(task => isSameDay(new Date(task.dueDate), date));
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 rounded-lg border shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">
                        {format(currentMonth, "MMMM yyyy")}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToToday}>{t.calendar.today}</Button>
                    <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" onClick={prevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={nextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 border-b bg-slate-100 dark:bg-slate-800">
                {weekDays.map(day => (
                    <div key={day} className="py-2 text-center text-sm font-semibold text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-6">
                {days.map((day, i) => {
                    const dayTasks = getTasksForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "border-r border-b p-2 min-h-[80px] flex flex-col transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50",
                                !isCurrentMonth && "bg-slate-50/50 dark:bg-slate-900/50 text-muted-foreground",
                                isSameDay(day, new Date()) && "bg-blue-50/30 dark:bg-blue-900/10"
                            )}
                        >
                            <span className={cn(
                                "text-sm w-7 h-7 flex items-center justify-center rounded-full mb-1",
                                isSameDay(day, new Date()) && "bg-primary text-primary-foreground font-bold"
                            )}>
                                {format(day, dateFormat)}
                            </span>

                            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                                {dayTasks.map(task => (
                                    <TooltipProvider key={task.id}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className={cn(
                                                    "text-[10px] truncate px-1.5 py-0.5 rounded cursor-pointer text-white font-medium",
                                                    typeColors[task.type]
                                                )}>
                                                    {task.title}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{task.title}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{task.type.replace('_', ' ').toLowerCase()}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="p-2 flex gap-4 text-xs text-muted-foreground border-t bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /> {t.tasks.form.types.exam}</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500" /> {t.tasks.form.types.assignment}</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /> {t.tasks.form.types.studySession}</div>
            </div>
        </div>
    );
}
