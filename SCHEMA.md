# StudySync Architecture Schema

## TypeScript Interfaces

### Core Entities

```typescript
// Course Information
export interface Course {
  id: string;
  name: string;
  professor: string;
  roomNumber: string;
  color: string; // Hex code for color coding
  schedule?: string; // e.g., "Mon/Wed 10:00 AM" (Optional for MVP)
}

// Task Types
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskType = 'ASSIGNMENT' | 'EXAM' | 'STUDY_SESSION' | 'OTHER';

export interface Task {
  id: string;
  courseId: string | null; // Can be null if it's a general personal task
  title: string;
  description?: string;
  dueDate: string; // ISO date string
  status: TaskStatus;
  type: TaskType;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Calendar Events (Derived from Tasks or standalone)
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resourceId?: string; // link to Course or Task
  type: 'EXAM' | 'ASSIGNMENT' | 'STUDY_SESSION';
}

// User / Student Profile
export interface StudentProfile {
  name: string;
  targetGpa: number;
  currentGpa: number; // Could be calculated from grades if we track them, or manual for MVP
}

// App State (Zustand Store Interface)
export interface StudyStore {
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
}
```

## Folder Structure

```
/
├── app/
│   ├── layout.tsx         # Global layout (Sidebar + Topbar)
│   ├── page.tsx           # Redirect to /dashboard or Landing
│   ├── globals.css        # Tailwind imports & custom vars
│   ├── dashboard/
│   │   └── page.tsx       # "Bento Box" Dashboard
│   ├── courses/
│   │   └── page.tsx       # Course Manager List/Grid
│   ├── tasks/
│   │   └── page.tsx       # Kanban Board
│   ├── calendar/
│   │   └── page.tsx       # Monthly Calendar View
│   └── focus/
│       └── page.tsx       # Pomodoro Timer
├── components/
│   ├── ui/                # shadcn/ui primitives (button, card, etc.)
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── dashboard/
│   │   ├── ScheduleWidget.tsx
│   │   ├── TasksSummaryWidget.tsx
│   │   └── GpaTrackerWidget.tsx
│   ├── courses/
│   │   ├── CourseCard.tsx
│   │   └── CourseForm.tsx
│   ├── tasks/
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   └── TaskCard.tsx
│   └── focus/
│       └── TimerDisplay.tsx
├── lib/
│   ├── store.ts           # Zustand store creation
│   ├── types.ts           # Shared interfaces (from above)
│   └── utils.ts           # Helper functions (cn, date formatting)
├── hooks/
│   └── use-store.ts       # Safe hydration wrapper for persisted store
└── public/
    └── icons/
```

## Technology Choices
- **State Management**: `zustand` with `persist` middleware for LocalStorage.
- **Styling**: `tailwindcss` configured with `shadcn/ui` preset.
- **Icons**: `lucide-react`.
- **Dates**: `date-fns` for manipulation and formatting.
