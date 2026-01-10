"use client";

import { useStore } from "@/hooks/use-store";
import { useStudyStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Flame, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export function HabitTrackerWidget() {
    const { t } = useLanguage();
    const habits = useStore(useStudyStore, (state) => state.habits) || [];
    const addHabit = useStudyStore((state) => state.addHabit);
    const deleteHabit = useStudyStore((state) => state.deleteHabit);
    const toggleHabit = useStudyStore((state) => state.toggleHabit);

    const [newHabit, setNewHabit] = useState("");

    const today = new Date().toISOString().split('T')[0];

    // Handle Add
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabit.trim()) return;

        addHabit({
            id: crypto.randomUUID(),
            title: newHabit,
            streak: 0,
            completedDates: []
        });
        setNewHabit("");
    };

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t.dashboard.habits.title}</CardTitle>
                <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                    <Input
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        placeholder={t.dashboard.habits.placeholder}
                        className="h-8 text-sm"
                    />
                    <Button type="submit" size="sm" variant="secondary" className="h-8 px-2">
                        <Plus className="h-4 w-4" />
                    </Button>
                </form>

                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {habits.length === 0 ? (
                        <p className="text-xs text-center text-muted-foreground py-2">
                            {t.dashboard.habits.empty}
                        </p>
                    ) : (
                        habits.map(habit => {
                            const isCompletedToday = habit.completedDates.includes(today);
                            return (
                                <div key={habit.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex items-center justify-center">
                                            <Checkbox
                                                id={`habit-${habit.id}`}
                                                checked={isCompletedToday}
                                                onCheckedChange={() => toggleHabit(habit.id, today)}
                                                className="h-5 w-5 rounded-full"
                                            />
                                        </div>
                                        <label
                                            htmlFor={`habit-${habit.id}`}
                                            className={cn(
                                                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer transition-all",
                                                isCompletedToday ? "line-through text-muted-foreground" : ""
                                            )}
                                        >
                                            {habit.title}
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center text-orange-500 text-xs font-bold gap-0.5" title="Current streak">
                                            <Flame className={cn("h-3 w-3 fill-orange-500", habit.streak > 0 ? "animate-pulse" : "opacity-50")} />
                                            {habit.streak}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => deleteHabit(habit.id)}
                                        >
                                            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
