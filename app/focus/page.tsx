"use client";
import { TimerDisplay } from "@/components/focus/TimerDisplay";

export default function FocusPage() {
    return (
        <div className="flex flex-col h-full items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Focus Mode</h2>
            <TimerDisplay />
        </div>
    )
}
