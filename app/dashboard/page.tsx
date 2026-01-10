"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useStudyStore } from "@/lib/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
    BookOpen,
    CheckSquare,
    Calendar as CalendarIcon,
    Brain,
    Timer,
    BarChart3,
    ArrowRight,
    Plus,
    TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { t } = useLanguage();
    const syncFromCloud = useStudyStore((state) => state.syncFromCloud);
    const router = useRouter();
    const profile = useStudyStore((state) => state.profile);
    const courses = useStudyStore((state) => state.courses);
    const tasks = useStudyStore((state) => state.tasks);

    useEffect(() => {
        syncFromCloud();
    }, [syncFromCloud]);

    const kanbanSections = [
        {
            title: t.dashboard.kanban.courses.title,
            icon: BookOpen,
            color: "from-blue-500 to-indigo-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            count: courses.length,
            route: "/courses",
            description: t.dashboard.kanban.courses.description
        },
        {
            title: t.dashboard.kanban.tasks.title,
            icon: CheckSquare,
            color: "from-purple-500 to-pink-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/20",
            count: tasks.filter(t => t.status !== 'COMPLETED').length,
            route: "/tasks",
            description: t.dashboard.kanban.tasks.description
        },
        {
            title: t.dashboard.kanban.calendar.title,
            icon: CalendarIcon,
            color: "from-green-500 to-emerald-600",
            bgColor: "bg-green-50 dark:bg-green-950/20",
            count: 0,
            route: "/calendar",
            description: t.dashboard.kanban.calendar.description
        },
        {
            title: t.dashboard.kanban.flashcards.title,
            icon: Brain,
            color: "from-orange-500 to-red-600",
            bgColor: "bg-orange-50 dark:bg-orange-950/20",
            count: 0,
            route: "/flashcards",
            description: t.dashboard.kanban.flashcards.description
        },
        {
            title: t.dashboard.kanban.focus.title,
            icon: Timer,
            color: "from-cyan-500 to-blue-600",
            bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
            count: 0,
            route: "/focus",
            description: t.dashboard.kanban.focus.description
        },
        {
            title: t.dashboard.kanban.analytics.title,
            icon: BarChart3,
            color: "from-violet-500 to-purple-600",
            bgColor: "bg-violet-50 dark:bg-violet-950/20",
            count: 0,
            route: "/analytics",
            description: t.dashboard.kanban.analytics.description
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        {t.dashboard.welcome} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{profile.name}</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">{t.dashboard.subtitle}</p>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 px-6 py-4 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{t.dashboard.stats.levelShort} {profile.level}</div>
                        <div className="text-xs text-muted-foreground">{t.dashboard.stats.level}</div>
                    </div>
                    <div className="h-10 w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent" />
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{profile.streak}</div>
                        <div className="text-xs text-muted-foreground">{t.dashboard.stats.dayStreak}</div>
                    </div>
                    <div className="h-10 w-px bg-gradient-to-b from-transparent via-purple-300 to-transparent" />
                    <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{profile.xp}</div>
                        <div className="text-xs text-muted-foreground">{t.dashboard.stats.xp}</div>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {kanbanSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <motion.div
                            key={section.title}
                            variants={cardVariants}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        >
                            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer h-full bg-card"
                                onClick={() => router.push(section.route)}
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                {/* Content */}
                                <div className="relative p-6 space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 rounded-2xl ${section.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`h-6 w-6 bg-gradient-to-br ${section.color} bg-clip-text text-transparent`} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-xs font-medium text-muted-foreground">{t.dashboard.kanban.actions.open}</span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-tight mb-1">{section.title}</h3>
                                        <p className="text-sm text-muted-foreground">{section.description}</p>
                                    </div>

                                    {/* Stats */}
                                    {section.count > 0 && (
                                        <div className="flex items-center gap-2 pt-2">
                                            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${section.color} text-white text-sm font-semibold`}>
                                                {section.count} {section.title === t.dashboard.kanban.tasks.title ? t.dashboard.kanban.tasks.active : t.dashboard.kanban.items}
                                            </div>
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        </div>
                                    )}

                                    {/* Quick Action */}
                                    <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(section.route);
                                        }}>
                                            <Plus className="h-4 w-4" />
                                            <span>{t.dashboard.kanban.actions.quickAdd}</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className={`absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${section.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                                <div className={`absolute -top-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-br ${section.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
