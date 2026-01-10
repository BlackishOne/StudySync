"use client";

import * as React from "react";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    BookOpen,
    ListTodo,
    Timer,
    BarChart3,
    Library,
    Plus
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useStudyStore } from "@/lib/store";

export function SearchCommand() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const { courses, tasks } = useStudyStore();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem onSelect={() => runCommand(() => router.push("/tasks"))}>
                        <ListTodo className="mr-2 h-4 w-4" />
                        <span>Tasks</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/calendar"))}>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Calendar</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/focus"))}>
                        <Timer className="mr-2 h-4 w-4" />
                        <span>Focus Mode</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Courses">
                    {courses.map(course => (
                        <CommandItem key={course.id} onSelect={() => runCommand(() => router.push(`/courses`))}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>{course.name}</span>
                        </CommandItem>
                    ))}
                    <CommandItem onSelect={() => runCommand(() => router.push("/courses"))}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Add Course</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Flashcards">
                    <CommandItem onSelect={() => runCommand(() => router.push("/flashcards"))}>
                        <Library className="mr-2 h-4 w-4" />
                        <span>Browse Decks</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Settings">
                    <CommandItem onSelect={() => runCommand(() => router.push("/analytics"))}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Analytics</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
