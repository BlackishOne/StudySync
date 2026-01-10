import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course, Task, StudentProfile, TaskStatus, TimerState, TimerMode, StudySession, TimerSettings, ClassSession, FlashcardDeck, Flashcard, CourseNote, Habit } from './types';
import { syncCourseToSupabase, deleteCourseFromSupabase, syncTaskToSupabase, deleteTaskFromSupabase, syncNoteToSupabase, deleteNoteFromSupabase, syncHabitToSupabase, deleteHabitFromSupabase, fetchAllUserData } from './supabase-actions';

interface StudyStore {
    courses: Course[];
    tasks: Task[];
    profile: StudentProfile;

    // Actions
    addCourse: (course: Course) => void;
    updateCourse: (id: string, updates: Partial<Course>) => void;
    deleteCourse: (id: string) => void;

    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    moveTask: (id: string, newStatus: TaskStatus) => void;
    deleteTask: (id: string) => void;

    updateProfile: (updates: Partial<StudentProfile>) => void;

    timer: TimerState;
    setTimer: (timer: TimerState) => void;
    tickTimer: () => void;
    switchMode: (mode: TimerMode) => void;
    updateTimerSettings: (settings: Partial<TimerSettings>) => void;

    // Timetable
    classSessions: ClassSession[];
    addClassSession: (session: ClassSession) => void;
    deleteClassSession: (id: string) => void;

    // Flashcards
    decks: FlashcardDeck[];
    cards: Flashcard[];
    addDeck: (deck: FlashcardDeck) => void;
    deleteDeck: (id: string) => void;
    addCard: (card: Flashcard) => void;
    deleteCard: (id: string) => void;
    updateCardProbability: (id: string, confidence: number) => void;

    // Gamification
    addXP: (amount: number) => void;

    studySessions: StudySession[];
    logSession: (duration: number, courseId?: string | null) => void;
    importData: (data: Partial<StudyStore>) => void;
    syncFromCloud: () => Promise<void>;

    // Notes
    notes: CourseNote[];
    addNote: (note: CourseNote) => void;
    updateNote: (id: string, updates: Partial<CourseNote>) => void;
    deleteNote: (id: string) => void;

    // Habits
    habits: Habit[];
    addHabit: (habit: Habit) => void;
    deleteHabit: (id: string) => void;
    toggleHabit: (id: string, date: string) => void;
}

export const useStudyStore = create<StudyStore>()(
    persist(
        (set) => ({
            courses: [],
            tasks: [],
            profile: {
                name: 'Student',
                targetGpa: 4.0,
                currentGpa: 3.5,
                isDarkMode: false,
                xp: 0,
                level: 1,
                streak: 0,
                lastStudyDate: null
            },
            timer: {
                mode: 'WORK',
                timeLeft: 25 * 60,
                isActive: false,
                settings: {
                    workDuration: 25,
                    shortBreakDuration: 5,
                    longBreakDuration: 15
                }
            },

            classSessions: [],
            decks: [],
            cards: [],

            addCourse: (course) => {
                set((state) => ({ courses: [...state.courses, course] }));
                syncCourseToSupabase(course);
            },
            updateCourse: (id, updates) =>
                set((state) => {
                    const updatedCourses = state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c));
                    const course = updatedCourses.find(c => c.id === id);
                    if (course) syncCourseToSupabase(course);
                    return { courses: updatedCourses };
                }),
            deleteCourse: (id) => {
                set((state) => ({
                    courses: state.courses.filter((c) => c.id !== id),
                    tasks: state.tasks.map(t => t.courseId === id ? { ...t, courseId: null } : t),
                    // Cascade delete related data
                    classSessions: state.classSessions.filter(s => s.courseId !== id),
                    decks: state.decks.filter(d => d.courseId !== id),
                    cards: state.cards.filter(c => !state.decks.find(d => d.courseId === id && d.id === c.deckId))
                }));
                deleteCourseFromSupabase(id);
            },

            addTask: (task) => {
                set((state) => ({ tasks: [...state.tasks, task] }));
                syncTaskToSupabase(task);
            },
            updateTask: (id, updates) =>
                set((state) => {
                    const updatedTasks = state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
                    const task = updatedTasks.find(t => t.id === id);
                    if (task) syncTaskToSupabase(task);
                    return { tasks: updatedTasks };
                }),
            moveTask: (id, newStatus) =>
                set((state) => {
                    const task = state.tasks.find(t => t.id === id);
                    let xpGain = 0;
                    if (task && task.status !== 'COMPLETED' && newStatus === 'COMPLETED') {
                        xpGain = 50;
                    }

                    const newProfile = { ...state.profile };
                    if (xpGain > 0) {
                        newProfile.xp += xpGain;
                        newProfile.level = Math.floor(newProfile.xp / 1000) + 1;
                    }

                    const updatedTasks = state.tasks.map((t) =>
                        t.id === id ? { ...t, status: newStatus } : t
                    );

                    const updatedTask = updatedTasks.find(t => t.id === id);
                    if (updatedTask) syncTaskToSupabase(updatedTask);

                    return {
                        tasks: updatedTasks,
                        profile: newProfile
                    };
                }),
            deleteTask: (id) => {
                set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
                deleteTaskFromSupabase(id);
            },

            updateProfile: (updates) =>
                set((state) => ({ profile: { ...state.profile, ...updates } })),

            setTimer: (timer) => set({ timer }),
            tickTimer: () => set((state) => ({
                timer: {
                    ...state.timer,
                    timeLeft: state.timer.timeLeft > 0 ? state.timer.timeLeft - 1 : 0
                }
            })),
            switchMode: (mode) => set((state) => {
                const settings = state.timer.settings || { workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15 };
                let duration = settings.workDuration;
                if (mode === 'SHORT_BREAK') duration = settings.shortBreakDuration;
                if (mode === 'LONG_BREAK') duration = settings.longBreakDuration;

                return {
                    timer: {
                        ...state.timer,
                        mode,
                        timeLeft: duration * 60,
                        isActive: false
                    }
                };
            }),
            updateTimerSettings: (newSettings) => set((state) => ({
                timer: {
                    ...state.timer,
                    settings: { ...state.timer.settings, ...newSettings }
                }
            })),

            // Timetable Actions
            addClassSession: (session) => set((state) => ({ classSessions: [...state.classSessions, session] })),
            deleteClassSession: (id) => set((state) => ({ classSessions: state.classSessions.filter(s => s.id !== id) })),

            // Flashcard Actions
            addDeck: (deck) => set((state) => ({ decks: [...state.decks, deck] })),
            deleteDeck: (id) => set((state) => ({
                decks: state.decks.filter(d => d.id !== id),
                cards: state.cards.filter(c => c.deckId !== id)
            })),
            addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
            deleteCard: (id) => set((state) => ({ cards: state.cards.filter(c => c.id !== id) })),
            updateCardProbability: (id, confidence) => set((state) => ({
                cards: state.cards.map(c => c.id === id ? { ...c, confidence } : c)
            })),

            // Gamification
            addXP: (amount) => set((state) => {
                const newXp = state.profile.xp + amount;
                const newLevel = Math.floor(newXp / 1000) + 1;
                return {
                    profile: { ...state.profile, xp: newXp, level: newLevel }
                };
            }),

            studySessions: [],
            logSession: (duration, courseId) => set((state) => {
                // Calculate streak
                const today = new Date().toISOString().split('T')[0];
                const last = state.profile.lastStudyDate ? state.profile.lastStudyDate.split('T')[0] : null;

                let newStreak = state.profile.streak;
                if (last !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];

                    if (last === yesterdayStr) {
                        newStreak += 1;
                    } else {
                        // Reset if broken? Or just keep building? Let's strictly reset for now or maybe keep it simple.
                        // Actually, if last was not yesterday and not today, streak resets.
                        newStreak = 1;
                    }
                }

                // XP Calculation: 10 XP per minute
                const minutes = Math.floor(duration / 60);
                const xpGained = minutes * 10;
                const newXp = (state.profile.xp || 0) + xpGained;
                const newLevel = Math.floor(newXp / 1000) + 1;

                return {
                    studySessions: [
                        ...state.studySessions,
                        {
                            id: crypto.randomUUID(),
                            date: new Date().toISOString(),
                            duration,
                            courseId
                        }
                    ],
                    profile: {
                        ...state.profile,
                        lastStudyDate: new Date().toISOString(),
                        streak: newStreak,
                        xp: newXp,
                        level: newLevel
                    }
                };
            }),

            importData: (data) => set((state) => ({
                ...state,
                ...data,
                courses: data.courses || state.courses,
                tasks: data.tasks || state.tasks,
                profile: data.profile || state.profile,
                studySessions: data.studySessions || state.studySessions,
                classSessions: data.classSessions || state.classSessions,
                decks: data.decks || state.decks,
                cards: data.cards || state.cards
            })),

            syncFromCloud: async () => {
                const data = await fetchAllUserData();
                if (data) {
                    set(state => ({
                        ...state,
                        courses: data.courses,
                        tasks: data.tasks,
                        notes: data.notes,
                        habits: data.habits,
                        profile: data.profileData ? {
                            ...state.profile,
                            ...data.profileData
                        } : state.profile
                    }));
                }
            },

            // Notes Implementation
            notes: [],
            addNote: (note) => {
                set((state) => ({ notes: [...state.notes, note] }));
                syncNoteToSupabase(note);
            },
            updateNote: (id, updates) => set((state) => {
                const updatedNotes = state.notes.map(n => n.id === id ? { ...n, ...updates } : n);
                const note = updatedNotes.find(n => n.id === id);
                if (note) syncNoteToSupabase(note);
                return { notes: updatedNotes };
            }),
            deleteNote: (id) => {
                set((state) => ({ notes: state.notes.filter(n => n.id !== id) }));
                deleteNoteFromSupabase(id);
            },

            // Habits Implementation
            habits: [],
            addHabit: (habit) => {
                set((state) => ({ habits: [...state.habits, habit] }));
                syncHabitToSupabase(habit);
            },
            deleteHabit: (id) => {
                set((state) => ({ habits: state.habits.filter(h => h.id !== id) }));
                deleteHabitFromSupabase(id);
            },
            toggleHabit: (id, date) => set((state) => {
                const habit = state.habits.find(h => h.id === id);
                if (!habit) return {};

                const checkExists = habit.completedDates.includes(date);
                let newDates = checkExists
                    ? habit.completedDates.filter(d => d !== date)
                    : [...habit.completedDates, date];

                newDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

                let streak = 0;
                const today = new Date().toISOString().split('T')[0];
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                let currentCheck = newDates.includes(today) ? today : yesterdayStr;

                let checkDate = new Date(currentCheck);
                while (true) {
                    const dateStr = checkDate.toISOString().split('T')[0];
                    if (newDates.includes(dateStr)) {
                        streak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        break;
                    }
                }

                const updatedHabits = state.habits.map(h => h.id === id ? { ...h, completedDates: newDates, streak } : h);
                const updatedHabit = updatedHabits.find(h => h.id === id);
                if (updatedHabit) syncHabitToSupabase(updatedHabit);

                return {
                    habits: updatedHabits
                };
            }),

        }),
        {
            name: 'studysync-storage', // key for localStorage
        }
    )
);
