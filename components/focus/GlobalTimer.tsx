"use client";

import { useEffect } from "react";
import { useStudyStore } from "@/lib/store";

export function GlobalTimer() {
    const isActive = useStudyStore((state) => state.timer.isActive);
    const tickTimer = useStudyStore((state) => state.tickTimer);
    const timeLeft = useStudyStore((state) => state.timer.timeLeft);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                tickTimer();
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished
            // Could trigger sound or notification here
            useStudyStore.getState().setTimer({ ...useStudyStore.getState().timer, isActive: false });
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, tickTimer]);

    return null; // Logic only component
}
