"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudyStore } from "@/lib/store";
import { useStore } from "@/hooks/use-store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { useLanguage } from "@/contexts/LanguageContext";
import { GradeCalculator } from "@/components/analytics/GradeCalculator";

import { useState, useEffect } from "react";

export default function AnalyticsPage() {
    const { t } = useLanguage();
    // Store Data
    const sessions = useStore(useStudyStore, (state) => state.studySessions) || [];
    const tasks = useStore(useStudyStore, (state) => state.tasks) || [];

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null; // or a loading spinner

    // Weekly Study Time Logic
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });

    const weeklyData = daysInWeek.map(day => {
        const daySessions = sessions.filter(session => isSameDay(parseISO(session.date), day));
        const totalMinutes = daySessions.reduce((acc, session) => acc + (session.duration / 60), 0);
        return {
            name: format(day, 'EEE'), // Mon, Tue...
            minutes: Math.round(totalMinutes)
        };
    });

    // Grade Distribution Logic
    const gradedTasks = tasks.filter(t => t.grade !== undefined && t.grade !== null);
    const hasGrades = gradedTasks.length > 0;

    const gradeDistribution = [
        { name: 'A (90-100)', min: 90, max: 100, color: '#4ade80', count: 0 },
        { name: 'B (80-89)', min: 80, max: 89, color: '#60a5fa', count: 0 },
        { name: 'C (70-79)', min: 70, max: 79, color: '#facc15', count: 0 },
        { name: 'D (60-69)', min: 60, max: 69, color: '#f87171', count: 0 },
        { name: 'F (<60)', min: 0, max: 59, color: '#94a3b8', count: 0 },
    ];

    gradedTasks.forEach(task => {
        const grade = task.grade || 0;
        const bucket = gradeDistribution.find(b => grade >= b.min && grade <= b.max);
        if (bucket) bucket.count++;
    });

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">{t.analytics.title}</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">

                {/* Weekly Study Time */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>{t.analytics.weeklyStudy}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="minutes" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Grade Distribution */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>{t.analytics.gradeDist}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                            Based on {gradedTasks.length} graded tasks
                        </div>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        {hasGrades ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={gradeDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                    >
                                        {gradeDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                No grades recorded yet.
                            </div>
                        )}
                        {hasGrades && (
                            <div className="space-y-2 text-sm ml-4">
                                {gradeDistribution.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span>{item.name}: {item.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <div className="col-span-1">
                    <GradeCalculator />
                </div>
            </div>
        </div >
    );
}
