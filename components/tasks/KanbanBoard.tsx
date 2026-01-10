"use client";

import { useStudyStore } from "@/lib/store";
import { useStore } from "@/hooks/use-store";
import { TaskCard } from "./TaskCard";
import { TaskStatus } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortableTask } from "./SortableTask";
import {
    DndContext,
    DragOverlay,
    useDroppable,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Task } from "@/lib/types";

import { useLanguage } from "@/contexts/LanguageContext";

// Columns moved inside component

function KanbanColumn({ colId, children }: { colId: string; children: React.ReactNode }) {
    const { setNodeRef } = useDroppable({
        id: colId,
    });

    return (
        <div ref={setNodeRef} className="flex-1 flex flex-col h-full">
            {children}
        </div>
    )
}

export function KanbanBoard() {
    const { t } = useLanguage();
    const tasks = useStore(useStudyStore, (state) => state.tasks) || [];
    const courses = useStore(useStudyStore, (state) => state.courses) || [];
    const moveTask = useStudyStore((state) => state.moveTask);

    const columns: { id: TaskStatus; label: string }[] = [
        { id: "TODO", label: t.tasks.columns.todo },
        { id: "IN_PROGRESS", label: t.tasks.columns.inProgress },
        { id: "COMPLETED", label: t.tasks.columns.completed },
    ];

    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeTask = tasks.find((t) => t.id === active.id);
        const overId = over.id as string;

        if (activeTask && activeTask.status !== overId) {
            // If dropped on a column container directly
            if (columns.some(c => c.id === overId)) {
                moveTask(activeTask.id, overId as TaskStatus);
            }
        }
        setActiveId(null);
    };

    const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
                {columns.map((col) => (
                    <div
                        key={col.id}
                        className="flex-1 flex flex-col min-w-[300px] h-full bg-slate-50 dark:bg-slate-900/50 rounded-lg border p-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                                {col.label}
                            </h3>
                            <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full text-muted-foreground">
                                {tasks.filter((t) => t.status === col.id).length}
                            </span>
                        </div>

                        <KanbanColumn colId={col.id}>
                            <ScrollArea className="flex-1 pr-4 -mr-4">
                                <div className="space-y-3 pb-4 pr-4 min-h-[100px]">
                                    {tasks
                                        .filter((t) => t.status === col.id)
                                        .map((task) => (
                                            <SortableTask key={task.id} task={task}>
                                                <TaskCard
                                                    task={task}
                                                    course={courses.find(
                                                        (c) => c.id === task.courseId
                                                    )}
                                                />
                                            </SortableTask>
                                        ))}
                                    {tasks.filter((t) => t.status === col.id).length === 0 && (
                                        <div className="text-center py-12 text-xs text-muted-foreground border-2 border-dashed rounded-lg opacity-50">
                                            Drop items here
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </KanbanColumn>
                    </div>
                ))}
            </div>

            {typeof document !== 'undefined' && createPortal(
                <DragOverlay>
                    {activeTask ? (
                        <TaskCard
                            task={activeTask}
                            course={courses.find((c) => c.id === activeTask.courseId)}
                        />
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}
