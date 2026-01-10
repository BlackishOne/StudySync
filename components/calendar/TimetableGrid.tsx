"use client";

import { useStudyStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ClassSession } from "@/lib/types";

// ... imports
import { useLanguage } from "@/contexts/LanguageContext";

const TIMES = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

export function TimetableGrid() {
    const { t } = useLanguage();
    const { courses, classSessions, addClassSession, deleteClassSession } = useStudyStore();
    const [isOpen, setIsOpen] = useState(false);

    // Translated Days
    const DAYS = [
        t.calendar.timetableGrid.monday,
        t.calendar.timetableGrid.tuesday,
        t.calendar.timetableGrid.wednesday,
        t.calendar.timetableGrid.thursday,
        t.calendar.timetableGrid.friday
    ];

    // Form State
    const [courseId, setCourseId] = useState("");
    const [dayOfWeek, setDayOfWeek] = useState("1"); // Monday default
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");
    const [type, setType] = useState<"LECTURE" | "LAB" | "TUTORIAL">("LECTURE");
    const [room, setRoom] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addClassSession({
            id: crypto.randomUUID(),
            courseId,
            dayOfWeek: parseInt(dayOfWeek),
            startTime,
            endTime,
            type,
            room
        });
        setIsOpen(false);
        // Reset vital fields
        setCourseId("");
    };

    const getSessionStyle = (session: ClassSession) => {
        // ... same style logic
        const startHour = parseInt(session.startTime.split(":")[0]);
        const startMin = parseInt(session.startTime.split(":")[1]);
        const endHour = parseInt(session.endTime.split(":")[0]);

        const topOffset = (startHour - 8) * 60 + (startMin);
        const duration = ((endHour * 60 + parseInt(session.endTime.split(":")[1])) - (startHour * 60 + startMin));

        return {
            top: `${topOffset}px`,
            height: `${duration}px`
        };
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">{t.calendar.timetable}</h2>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> {t.calendar.timetableGrid.addSession}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t.calendar.timetableGrid.addSession}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t.courses.form.name}</Label>
                                <Select value={courseId} onValueChange={setCourseId} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.tasks.form.selectCourse || "Select Course"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t.calendar.timetableGrid.day}</Label>
                                    <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">{t.calendar.timetableGrid.monday}</SelectItem>
                                            <SelectItem value="2">{t.calendar.timetableGrid.tuesday}</SelectItem>
                                            <SelectItem value="3">{t.calendar.timetableGrid.wednesday}</SelectItem>
                                            <SelectItem value="4">{t.calendar.timetableGrid.thursday}</SelectItem>
                                            <SelectItem value="5">{t.calendar.timetableGrid.friday}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.calendar.timetableGrid.type}</Label>
                                    <Select value={type} onValueChange={(v: any) => setType(v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LECTURE">{t.calendar.timetableGrid.lecture}</SelectItem>
                                            <SelectItem value="LAB">{t.calendar.timetableGrid.lab}</SelectItem>
                                            <SelectItem value="TUTORIAL">{t.calendar.timetableGrid.tutorial}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t.calendar.timetableGrid.startTime}</Label>
                                    <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.calendar.timetableGrid.endTime}</Label>
                                    <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>{t.calendar.timetableGrid.room} (Optional)</Label>
                                <Input value={room} onChange={e => setRoom(e.target.value)} placeholder="e.g. 301" />
                            </div>
                            <Button type="submit" className="w-full">{t.calendar.timetableGrid.save}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg overflow-x-auto bg-white dark:bg-slate-900">
                <div className="min-w-[800px]">
                    {/* Header */}
                    <div className="grid grid-cols-6 border-b">
                        <div className="p-4 text-center font-medium text-muted-foreground border-r">Time</div>
                        {DAYS.map(day => (
                            <div key={day} className="p-4 text-center font-medium border-r last:border-r-0">{day}</div>
                        ))}
                    </div>

                    {/* Grid Body */}
                    <div className="relative" style={{ height: '780px' }}> {/* 13 hours * 60px */}
                        {/* Time Slots Background */}
                        {TIMES.map((hour, i) => (
                            <div key={hour} className="absolute w-full border-b text-xs text-muted-foreground p-2" style={{ top: `${i * 60}px` }}>
                                {hour}:00
                            </div>
                        ))}

                        {/* Sessions */}
                        {classSessions.map(session => {
                            // Will render in day columns below, keeping null output here as in original
                            return null;
                        })}

                        <div className="grid grid-cols-6 h-full absolute top-0 w-full pointer-events-none">
                            <div className="border-r"></div> {/* Time Col */}
                            {[1, 2, 3, 4, 5].map(dayIndex => (
                                <div key={dayIndex} className="border-r last:border-r-0 relative pointer-events-auto h-full">
                                    {classSessions.filter(s => s.dayOfWeek === dayIndex).map(session => {
                                        const course = courses.find(c => c.id === session.courseId);
                                        const style = getSessionStyle(session);
                                        return (
                                            <div
                                                key={session.id}
                                                className="absolute w-[95%] left-[2.5%] rounded p-2 text-xs border overflow-hidden hover:opacity-90 transition cursor-pointer group"
                                                style={{
                                                    top: style.top,
                                                    height: style.height,
                                                    backgroundColor: `${course?.color}20`, // 20% opacity
                                                    borderColor: course?.color,
                                                    borderLeftWidth: '4px'
                                                }}
                                            >
                                                <div className="font-semibold truncate">{course?.name}</div>
                                                <div className="opacity-75 truncate">{session.type} • {session.room}</div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                                                    onClick={(e) => { e.stopPropagation(); deleteClassSession(session.id); }}
                                                >
                                                    <Trash2 className="h-3 w-3 text-red-500" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
