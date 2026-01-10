"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Task, Course, TaskStatus } from "@/lib/types";
import { formatDistanceToNow, parseISO, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudyStore } from "@/lib/store";

interface TaskCardProps {
    task: Task;
    course?: Course;
}

export function TaskCard({ task, course }: TaskCardProps) {
    const dueDate = parseISO(task.dueDate);
    const isOverdue = isPast(dueDate) && task.status !== 'COMPLETED';

    const deleteTask = useStudyStore((state) => state.deleteTask);
    const moveTask = useStudyStore((state) => state.moveTask);

    const handleMove = (status: TaskStatus) => {
        moveTask(task.id, status);
    };

    return (
        <Card className="mb-3 hover:shadow-sm transition-shadow">
            <CardContent className="p-3 space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <span className="text-sm font-medium leading-tight">{task.title}</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-6 w-6 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleMove('TODO')}>To Do</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMove('IN_PROGRESS')}>In Progress</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMove('COMPLETED')}>Completed</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteTask(task.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {course && (
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: course.color }} />
                        <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{course.name}</span>
                    </div>
                )}

                <div className="flex items-center justify-between mt-2 gap-2">
                    <Badge variant={isOverdue ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0 h-5 whitespace-nowrap">
                        {isOverdue ? "Overdue" : formatDistanceToNow(dueDate, { addSuffix: true })}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{task.type}</span>
                </div>
            </CardContent>
        </Card>
    )
}
