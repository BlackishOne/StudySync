"use client";

import { useStudyStore } from "@/lib/store";
import { useStore } from "@/hooks/use-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isToday, parseISO } from "date-fns";
import { Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ScheduleWidget() {
    const { t } = useLanguage();
    const tasks = useStore(useStudyStore, (state) => state.tasks);
    const courses = useStore(useStudyStore, (state) => state.courses);

    if (!tasks || !courses) return <Card className="col-span-2"><CardContent className="pt-6">{t.dashboard.loading}</CardContent></Card>;

    // Filter items due today
    const todayTasks = tasks.filter(task => {
        try {
            return isToday(parseISO(task.dueDate));
        } catch (e) {
            return false;
        }
    });

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>{t.dashboard.todaysSchedule}</CardTitle>
            </CardHeader>
            <CardContent>
                {todayTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                            <Coffee className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-muted-foreground max-w-[200px] leading-snug">
                            {t.dashboard.noEvents}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {todayTasks.map(task => {
                            const course = courses.find(c => c.id === task.courseId);
                            return (
                                <div key={task.id} className="flex items-center">
                                    <div className="mr-4 h-2 w-2 rounded-full" style={{ backgroundColor: course?.color || '#cbd5e1' }} />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{task.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {course ? course.name : t.dashboard.personal} - {format(parseISO(task.dueDate), 'h:mm a')}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                        {task.type}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
