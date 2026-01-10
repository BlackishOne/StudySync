"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { useStudyStore } from "@/lib/store";
import { Plus } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    professor: z.string().min(2, { message: "Professor is required." }),
    roomNumber: z.string().min(1, { message: "Room number is required." }),
    credits: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 10, {
        message: "Credits must be a number between 1 and 10.",
    }),
    color: z.string().regex(/^#/, { message: "Must be a valid hex code." }),
    resources: z.array(z.object({
        title: z.string().min(1),
        url: z.string().url().optional().or(z.literal('')),
        type: z.enum(['LINK', 'NOTE'])
    })).optional(),
});

// ... imports
import { useLanguage } from "@/contexts/LanguageContext";

// Schema remains static

export function CourseForm() {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const addCourse = useStudyStore((state) => state.addCourse);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            professor: "",
            roomNumber: "",
            credits: "3",
            color: "#0f172a",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        addCourse({
            id: uuidv4(),
            ...values,
            credits: Number(values.credits),
            resources: values.resources?.map(r => ({ ...r, id: uuidv4() }))
        });
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> {t.courses.addCourse}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t.courses.form.addTitle}</DialogTitle>
                    <DialogDescription>
                        {/* Description removed or could be translated if needed, keeping simple */}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.courses.form.name}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t.courses.form.courseNamePlaceholder} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="professor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.courses.form.professor}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t.courses.form.professorPlaceholder} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="roomNumber"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>{t.courses.form.location}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t.courses.form.locationPlaceholder} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="credits"
                                render={({ field }) => (
                                    <FormItem className="flex-[0.5]">
                                        <FormLabel>{t.courses.form.credits}</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.courses.form.color}</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-2">
                                                <Input type="color" className="w-12 p-1 h-10" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">{t.courses.form.save}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
