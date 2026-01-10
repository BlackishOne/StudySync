"use client";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TasksPage() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold tracking-tight">{t.tasks.boardTitle}</h2>
                <TaskForm />
            </div>
            <div className="flex-1 min-h-0">
                <KanbanBoard />
            </div>
        </div>
    )
}
