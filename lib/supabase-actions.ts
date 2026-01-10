import { createClient } from "@/utils/supabase/client";
import { Course, Task, CourseNote, Habit, StudentProfile } from "./types";

const supabase = createClient();

// --- Mappers ---

export const mapCourseToDB = (course: Course, userId: string) => ({
    id: course.id,
    user_id: userId,
    name: course.name,
    color: course.color,
    professor: course.professor,
    room_number: course.roomNumber,
    schedule: course.schedule || null,
    credits: course.credits
});

export const mapTaskToDB = (task: Task, userId: string) => ({
    id: task.id,
    user_id: userId,
    course_id: task.courseId,
    title: task.title,
    description: task.description || null,
    status: task.status,
    priority: task.priority || 'MEDIUM',
    due_date: task.dueDate,
    type: task.type,
    grade: task.grade || null
});

export const mapNoteToDB = (note: CourseNote, userId: string) => ({
    id: note.id,
    user_id: userId,
    course_id: note.courseId,
    title: note.title,
    content: note.content,
    created_at: note.createdAt,
    updated_at: note.updatedAt
});

export const mapHabitToDB = (habit: Habit, userId: string) => ({
    id: habit.id,
    user_id: userId,
    title: habit.title,
    streak: habit.streak,
    completed_dates: habit.completedDates
});

// --- Actions ---

export async function syncCourseToSupabase(course: Course) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('courses').upsert(mapCourseToDB(course, user.id));
}

export async function deleteCourseFromSupabase(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('courses').delete().eq('id', id);
}

export async function syncTaskToSupabase(task: Task) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('tasks').upsert(mapTaskToDB(task, user.id));
}

export async function deleteTaskFromSupabase(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('tasks').delete().eq('id', id);
}

export async function syncNoteToSupabase(note: CourseNote) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('notes').upsert(mapNoteToDB(note, user.id));
}

export async function deleteNoteFromSupabase(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('notes').delete().eq('id', id);
}

export async function syncHabitToSupabase(habit: Habit) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('habits').upsert(mapHabitToDB(habit, user.id));
}

export async function deleteHabitFromSupabase(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('habits').delete().eq('id', id);
}

export async function fetchAllUserData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const [courses, tasks, notes, habits, profileResult] = await Promise.all([
        supabase.from('courses').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('notes').select('*'),
        supabase.from('habits').select('*'),
        supabase.from('profiles').select('role, xp, level, streak, full_name').eq('id', user.id).single()
    ]);

    // Map back to local types
    return {
        profileData: profileResult.data ? {
            role: profileResult.data.role as 'student' | 'admin',
            xp: profileResult.data.xp,
            level: profileResult.data.level,
            streak: profileResult.data.streak,
            name: profileResult.data.full_name
        } : null,
        courses: (courses.data || []).map(c => ({
            id: c.id,
            name: c.name,
            professor: c.professor,
            roomNumber: c.room_number,
            color: c.color,
            schedule: c.schedule,
            credits: c.credits,
            resources: [] // Not synced yet
        }) as Course),
        tasks: (tasks.data || []).map(t => ({
            id: t.id,
            courseId: t.course_id,
            title: t.title,
            description: t.description,
            dueDate: t.due_date,
            status: t.status,
            type: t.type,
            priority: t.priority,
            grade: t.grade
        }) as Task),
        notes: (notes.data || []).map(n => ({
            id: n.id,
            courseId: n.course_id,
            title: n.title,
            content: n.content,
            createdAt: n.created_at,
            updatedAt: n.updated_at
        }) as CourseNote),
        habits: (habits.data || []).map(h => ({
            id: h.id,
            title: h.title,
            streak: h.streak,
            completedDates: h.completed_dates || []
        }) as Habit)
    };
}
