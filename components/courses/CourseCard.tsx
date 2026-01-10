"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Link as LinkIcon, StickyNote } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { calculateCourseAverage, getGradePoint } from "@/lib/gpa-utils";
import { useStore } from "@/hooks/use-store";
import { useStudyStore } from "@/lib/store";
import { useLanguage } from "@/contexts/LanguageContext";

interface CourseCardProps {
    course: Course;
    onDelete: (id: string) => void;
    onEdit: (course: Course) => void;
}

export function CourseCard({ course, onDelete, onEdit }: CourseCardProps) {
    const { t } = useLanguage();
    const tasks = useStore(useStudyStore, (state) => state.tasks) || [];
    const average = calculateCourseAverage(course.id, tasks);
    const gradePoint = average !== null ? getGradePoint(average) : null;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                    {course.name}
                </CardTitle>
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: course.color }} />
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-2xl font-bold">
                            {average ? `${average.toFixed(0)}%` : "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {gradePoint !== null ? `${gradePoint.toFixed(1)} GPA` : "No grades"}
                        </p>
                    </div>
                    <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {course.credits} Cr
                    </span>
                </div>

                <div className="text-sm text-muted-foreground mt-2 space-y-1">
                    <p>👨‍🏫 {course.professor}</p>
                    <p>📍 {course.roomNumber}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-auto">
                                <LinkIcon className="h-4 w-4 mr-2" />
                                {t.courses.resources}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{course.name} {t.courses.resources}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                {course.resources && course.resources.length > 0 ? (
                                    course.resources.map(resource => (
                                        <div key={resource.id} className="flex items-center justify-between p-2 border rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                {resource.type === 'LINK' ? <LinkIcon className="h-4 w-4 text-blue-500" /> : <StickyNote className="h-4 w-4 text-yellow-500" />}
                                                <a href={resource.url || "#"} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                                                    {resource.title}
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No resources added yet.</p>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm" asChild>
                        <a href={`/courses/${course.id}/notes`}>
                            <StickyNote className="h-4 w-4 mr-2" />
                            Notes
                        </a>
                    </Button>

                    <Button variant="ghost" size="icon" onClick={() => onEdit(course)}>
                        <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(course.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
