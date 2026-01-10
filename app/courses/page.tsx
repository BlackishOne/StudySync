"use client";

import { useStudyStore } from "@/lib/store";
import { useStore } from "@/hooks/use-store";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseForm } from "@/components/courses/CourseForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CoursesPage() {
    const { t } = useLanguage();
    const courses = useStore(useStudyStore, (state) => state.courses) || [];
    const deleteCourse = useStudyStore((state) => state.deleteCourse);
    const updateCourse = useStudyStore((state) => state.updateCourse);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">{t.courses.title}</h2>
                <CourseForm />
            </div>

            {courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>{t.courses.empty}</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onDelete={deleteCourse}
                            onEdit={(c) => console.log('Edit unimplemented for now', c)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
