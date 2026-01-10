# StudySync Execution Plan

## Phase 2: Scaffolding
- [ ] Initialize Next.js 14 project (TypeScript, ESLint, Tailwind)
- [ ] Clean up initial boilerplate (remove default page content)
- [ ] Install dependencies:
    - `shadcn-ui` (init and add components)
    - `zustand`
    - `lucide-react`
    - `date-fns`
- [ ] Setup Global Layout
    - [ ] Create `Sidebar` component with navigation links
    - [ ] Create `Topbar` component (Mock user profile/settings)
    - [ ] Update `app/layout.tsx` to include Sidebar and Topbar

## Phase 3: Component Implementation
- [ ] **Dashboard Components**
    - [ ] `ScheduleWidget`: Show today's items
    - [ ] `TasksSummaryWidget`: Count of active/completed tasks
    - [ ] `GpaTrackerWidget`: Display current GPA
- [ ] **Course Components**
    - [ ] `CourseCard`: Display color-coded course info
    - [ ] `CourseForm`: Modal/Page to add/edit courses
- [ ] **Task Board Components**
    - [ ] `KanbanBoard`: Layout for columns
    - [ ] `KanbanColumn`: Droppable area (if dnd used) or simple list
    - [ ] `TaskCard`: Individual task item with countdown
- [ ] **Focus Components**
    - [ ] `PomodoroTimer`: Timer logic and display

## Phase 4: Logic Integration
- [ ] **State Management (Zustand)**
    - [ ] Define `Course` and `Task` slices
    - [ ] Implement `persist` middleware for LocalStorage
    - [ ] Create hooks for accessing data
- [ ] **Feature Handling**
    - [ ] **Courses**: Implement Add/Remove/Update logic
    - [ ] **Tasks**: Implement Status change (move columns), Add Task, Delete Task
    - [ ] **Focus Mode**: Implement timer start/stop/reset logic logic (persisted in local state or global)
- [ ] **Page Integration**
    - [ ] Connect `Dashboard` widgets to store selectors
    - [ ] Connect `Courses` page to Course list and Form
    - [ ] Connect `Tasks` page to Kanban board and store actions

## Phase 5: Verification
- [ ] **Browser Testing**
    - [ ] Verify "Advanced Calculus" course creation
    - [ ] Verify "Midterm Prep" task creation
    - [ ] Check Dashboard for data reflection
    - [ ] Test Data Persistence (Reload page)
