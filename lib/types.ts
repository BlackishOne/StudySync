export interface Course {
    id: string;
    name: string;
    professor: string;
    roomNumber: string;
    color: string; // Hex code
    schedule?: string;
    credits: number;
    resources?: CourseResource[];
}

export interface CourseResource {
    id: string;
    title: string;
    url?: string;
    type: 'LINK' | 'NOTE';
    content?: string;
}

export interface ClassSession {
    id: string;
    courseId: string;
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    type: 'LECTURE' | 'LAB' | 'TUTORIAL';
    room?: string;
}

export interface FlashcardDeck {
    id: string;
    courseId: string; // can be "GENERAL" if no course
    title: string;
    lastStudied?: string;
}

export interface Flashcard {
    id: string;
    deckId: string;
    front: string;
    back: string;
    confidence: number; // 0-5
}

export interface StudySession {
    id: string;
    date: string; // ISO string
    duration: number; // in seconds
    courseId?: string | null;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskType = 'ASSIGNMENT' | 'EXAM' | 'STUDY_SESSION' | 'OTHER';

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Task {
    id: string;
    courseId: string | null; // null for general tasks
    title: string;
    description?: string;
    dueDate: string; // ISO date string
    status: TaskStatus;
    type: TaskType;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    grade?: number; // 0-100
    subtasks?: Subtask[];
}

export interface StudentProfile {
    name: string;
    email?: string;
    avatar_url?: string;
    targetGpa: number;
    currentGpa: number;
    isDarkMode: boolean; // Add state for dark mode preference if needed (though usually handled by theme provider)
    xp: number;
    level: number;
    streak: number;
    lastStudyDate: string | null;
    role?: 'student' | 'admin';
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resourceId?: string;
    type: 'EXAM' | 'ASSIGNMENT' | 'STUDY_SESSION';
    color?: string;
}

export type TimerMode = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';

export interface TimerSettings {
    workDuration: number; // in minutes
    shortBreakDuration: number;
    longBreakDuration: number;
}

export interface TimerState {
    mode: TimerMode;
    timeLeft: number;
    isActive: boolean;
    settings: TimerSettings;
}

export interface CourseNote {
    id: string;
    courseId: string;
    title: string;
    content: string; // Markdown
    createdAt: string;
    updatedAt: string;
}

export interface Habit {
    id: string;
    title: string;
    streak: number;
    completedDates: string[]; // ISO Date strings (YYYY-MM-DD)
}
