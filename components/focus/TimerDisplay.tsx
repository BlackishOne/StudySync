"use client";

import { useStudyStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Brain, Armchair, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TimerDisplay() {
    const { mode, timeLeft, isActive } = useStudyStore((state) => state.timer);
    const setTimer = useStudyStore((state) => state.setTimer);
    const switchMode = useStudyStore((state) => state.switchMode);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const toggleTimer = () => {
        setTimer({ ...useStudyStore.getState().timer, isActive: !isActive });
    };

    const resetTimer = () => {
        switchMode(mode); // Reset to current mode duration
    };

    const updateTimerSettings = useStudyStore((state) => state.updateTimerSettings);
    const settings = useStudyStore((state) => state.timer.settings) || { workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15 };

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // Watch for timer completion
    useEffect(() => {
        if (timeLeft === 0 && mode === 'WORK') {
            if (Notification.permission === "granted") {
                new Notification("Time's up!", { body: "Work session completed. Take a break!" });
            }
            toast.success("Work session completed!");
        }
    }, [timeLeft, mode]);

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateTimerSettings(localSettings);
        setIsSettingsOpen(false);
        toast.success("Timer settings updated!");
        // Apply settings immediately if not active, or let user switch mode
    };

    const applyPreset = (work: number, short: number, long: number) => {
        setLocalSettings({ workDuration: work, shortBreakDuration: short, longBreakDuration: long });
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8">
            <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-2 rounded-full flex-wrap justify-center">
                <Button variant={mode === "WORK" ? "default" : "ghost"} size="sm" onClick={() => switchMode("WORK")} className="rounded-full">
                    <Brain className="mr-2 h-4 w-4" /> Work
                </Button>
                <Button variant={mode === "SHORT_BREAK" ? "default" : "ghost"} size="sm" onClick={() => switchMode("SHORT_BREAK")} className="rounded-full">
                    <Coffee className="mr-2 h-4 w-4" /> Short
                </Button>
                <Button variant={mode === "LONG_BREAK" ? "default" : "ghost"} size="sm" onClick={() => switchMode("LONG_BREAK")} className="rounded-full">
                    <Armchair className="mr-2 h-4 w-4" /> Long
                </Button>

                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="rounded-full">
                            <Settings className="mr-2 h-4 w-4" /> Configure
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Timer Settings</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSettingsSubmit} className="space-y-6">
                            <div className="flex gap-2 justify-center pb-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => applyPreset(25, 5, 15)}>Pomodoro</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => applyPreset(50, 10, 30)}>Deep Work</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => applyPreset(90, 20, 40)}>Exam Mode</Button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label>Work Duration</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={localSettings.workDuration}
                                            onChange={(e) => setLocalSettings({ ...localSettings, workDuration: Number(e.target.value) })}
                                        />
                                        <span className="text-xs text-muted-foreground">min</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label>Short Break</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={localSettings.shortBreakDuration}
                                            onChange={(e) => setLocalSettings({ ...localSettings, shortBreakDuration: Number(e.target.value) })}
                                        />
                                        <span className="text-xs text-muted-foreground">min</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label>Long Break</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={localSettings.longBreakDuration}
                                            onChange={(e) => setLocalSettings({ ...localSettings, longBreakDuration: Number(e.target.value) })}
                                        />
                                        <span className="text-xs text-muted-foreground">min</span>
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Save Settings</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative">
                <div className="text-9xl font-bold font-mono tracking-tighter text-slate-800 dark:text-slate-100">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex gap-6">
                <Button size="lg" className="h-14 w-32 text-lg rounded-full" onClick={toggleTimer}>
                    {isActive ? <><Pause className="mr-2" /> Pause</> : <><Play className="mr-2" /> Start</>}
                </Button>
                <Button size="lg" variant="outline" className="h-14 w-14 rounded-full p-0" onClick={resetTimer}>
                    <RotateCcw className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
