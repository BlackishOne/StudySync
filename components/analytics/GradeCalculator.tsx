"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calculator } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function GradeCalculator() {
    const { t } = useLanguage();

    const [currentGrade, setCurrentGrade] = useState("");
    const [weightCompleted, setWeightCompleted] = useState("");
    const [targetGrade, setTargetGrade] = useState("");
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        const current = parseFloat(currentGrade);
        const weight = parseFloat(weightCompleted);
        const target = parseFloat(targetGrade);

        if (isNaN(current) || isNaN(weight) || isNaN(target)) return;

        // Formula: (Target - (Current * Weight/100)) / (1 - Weight/100)
        const weightRemaining = 100 - weight;
        if (weightRemaining <= 0) return;

        const gradePointsSecured = current * (weight / 100);
        const pointsNeeded = target - gradePointsSecured;
        const requiredScore = (pointsNeeded / weightRemaining) * 100;

        setResult(requiredScore);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{t.analytics.gradeCalc.title}</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">Estimate what you need on your final exam/remaining work.</p>
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs">{t.analytics.gradeCalc.currentGrade}</Label>
                            <Input
                                type="number"
                                value={currentGrade}
                                onChange={e => setCurrentGrade(e.target.value)}
                                placeholder="85"
                                className="h-8"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">{t.analytics.gradeCalc.weightCompleted}</Label>
                            <Input
                                type="number"
                                value={weightCompleted}
                                onChange={e => setWeightCompleted(e.target.value)}
                                placeholder="70"
                                className="h-8"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">{t.analytics.gradeCalc.targetGrade}</Label>
                            <Input
                                type="number"
                                value={targetGrade}
                                onChange={e => setTargetGrade(e.target.value)}
                                placeholder="90"
                                className="h-8"
                            />
                        </div>
                    </div>
                    <Button onClick={calculate} size="sm" className="w-full">{t.analytics.gradeCalc.calculate}</Button>

                    {result !== null && (
                        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                            <div className="text-xs text-muted-foreground mb-1">{t.analytics.gradeCalc.result}</div>
                            <div className={`text-2xl font-bold ${result > 100 ? "text-red-500" : "text-green-500"}`}>
                                {result.toFixed(1)}%
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-1">
                                {t.analytics.gradeCalc.onRemaining} {100 - parseFloat(weightCompleted)}%
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
