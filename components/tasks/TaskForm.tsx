"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useStudyStore } from "@/lib/store";
import { useStore } from "@/hooks/use-store";

const formSchema = z.object({
    title: z.string().min(2, "Title is required"),
    courseId: z.string(),
    type: z.enum(["ASSIGNMENT", "EXAM", "STUDY_SESSION", "OTHER"]),
    dueDate: z.date(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    grade: z.string().optional(),
});

// ... imports
import { useLanguage } from "@/contexts/LanguageContext";

// ... formSchema definition (remains static mostly, messages could be translated but keeping simple for now)

export function TaskForm() {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const courses = useStore(useStudyStore, (state) => state.courses) || [];
    const addTask = useStudyStore((state) => state.addTask);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            courseId: "none",
            type: "ASSIGNMENT",
            priority: "MEDIUM",
            grade: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Convert grade string to number if present
        const gradeNumber = values.grade ? parseFloat(values.grade) : undefined;

        addTask({
            id: uuidv4(),
            title: values.title,
            courseId: values.courseId === "none" ? null : values.courseId,
            type: values.type,
            dueDate: values.dueDate.toISOString(),
            status: "TODO",
            priority: values.priority,
            grade: gradeNumber,
        });
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> {t.tasks.addTask}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t.tasks.form.title}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.tasks.form.taskTitle}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Midterm Exam" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="courseId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.tasks.form.course}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t.tasks.form.selectCourse} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">{t.tasks.form.noCourse}</SelectItem>
                                            {courses.map((course) => (
                                                <SelectItem key={course.id} value={course.id}>
                                                    {course.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>{t.tasks.form.type}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t.tasks.form.type} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ASSIGNMENT">{t.tasks.form.types.assignment}</SelectItem>
                                                <SelectItem value="EXAM">{t.tasks.form.types.exam}</SelectItem>
                                                <SelectItem value="STUDY_SESSION">{t.tasks.form.types.studySession}</SelectItem>
                                                <SelectItem value="OTHER">{t.tasks.form.types.other}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>{t.tasks.form.priority}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t.tasks.form.priority} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="LOW">{t.tasks.form.priorities.low}</SelectItem>
                                                <SelectItem value="MEDIUM">{t.tasks.form.priorities.medium}</SelectItem>
                                                <SelectItem value="HIGH">{t.tasks.form.priorities.high}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="grade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.tasks.form.grade}</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g. 95" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t.tasks.form.dueDate}</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>{t.tasks.form.pickDate}</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">{t.tasks.form.save}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
