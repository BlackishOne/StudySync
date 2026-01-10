"use client";

import { useStudyStore } from "@/lib/store";
import { useStore } from "@/hooks/use-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateGPA } from "@/lib/gpa-utils";
import { useLanguage } from "@/contexts/LanguageContext";

export function GpaTrackerWidget() {
    const { t } = useLanguage();
    const profile = useStore(useStudyStore, (state) => state.profile);
    const courses = useStore(useStudyStore, (state) => state.courses) || [];
    const tasks = useStore(useStudyStore, (state) => state.tasks) || [];

    if (!profile) {
        return (
            <Card>
                <CardContent className="pt-6">{t.dashboard.loading}</CardContent>
            </Card>
        );
    }

    const calculatedGpa = calculateGPA(courses, tasks);
    // Use calculated GPA if available (non-zero), otherwise fallback to profile default or 0
    // Actually typically we want to show the calculated one if they have courses.
    const displayGpa = courses.length > 0 ? calculatedGpa : profile.currentGpa;

    const { targetGpa } = profile;
    const progress = (displayGpa / 4.0) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">{t.dashboard.gpa}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{displayGpa.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mb-4">
                    {t.dashboard.gpaTarget}: {targetGpa.toFixed(2)}
                </p>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                    {progress < 100 ? t.dashboard.gpaMotivation : t.dashboard.gpaExcellent}
                </p>
            </CardContent>
        </Card>
    );
}
