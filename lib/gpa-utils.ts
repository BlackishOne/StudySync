import { Course, Task } from "./types";

export function getGradePoint(percentage: number): number {
    if (percentage >= 93) return 4.0;
    if (percentage >= 90) return 3.7;
    if (percentage >= 87) return 3.3;
    if (percentage >= 83) return 3.0;
    if (percentage >= 80) return 2.7;
    if (percentage >= 77) return 2.3;
    if (percentage >= 73) return 2.0;
    if (percentage >= 70) return 1.7;
    if (percentage >= 67) return 1.3;
    if (percentage >= 65) return 1.0;
    return 0.0;
}

export function calculateCourseAverage(courseId: string, tasks: Task[]): number | null {
    const courseTasks = tasks.filter(t =>
        t.courseId === courseId &&
        (t.type === 'EXAM' || t.type === 'ASSIGNMENT') &&
        t.status === 'COMPLETED' &&
        t.grade !== undefined
    );

    if (courseTasks.length === 0) return null;

    const sum = courseTasks.reduce((acc, t) => acc + (t.grade || 0), 0);
    return sum / courseTasks.length;
}

export function calculateGPA(courses: Course[], tasks: Task[]): number {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        const average = calculateCourseAverage(course.id, tasks);
        if (average !== null) {
            const gradePoint = getGradePoint(average);
            totalPoints += gradePoint * course.credits;
            totalCredits += course.credits;
        }
    });

    if (totalCredits === 0) return 0;
    return totalPoints / totalCredits;
}
