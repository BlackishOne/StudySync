"use client";

import { useStore } from "@/hooks/use-store";
import { useStudyStore } from "@/lib/store";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext"; // Use for basic actions, though full translation might be pending

export default function CourseNotesPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const notes = useStore(useStudyStore, (state) => state.notes) || [];
    const addNote = useStudyStore((state) => state.addNote);
    const updateNote = useStudyStore((state) => state.updateNote);
    const deleteNote = useStudyStore((state) => state.deleteNote);

    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const courseNotes = notes.filter(n => n.courseId === courseId);

    // Determine if creating new or editing
    const handleNewNote = () => {
        setSelectedNoteId(null);
        setTitle("");
        setContent("");
        setIsEditing(true);
    };

    const handleSelectNote = (noteId: string) => {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            setSelectedNoteId(noteId);
            setTitle(note.title);
            setContent(note.content);
            setIsEditing(true);
        }
    };

    const handleSave = () => {
        if (!title.trim()) return;

        if (selectedNoteId) {
            updateNote(selectedNoteId, {
                title,
                content,
                updatedAt: new Date().toISOString()
            });
        } else {
            const newId = crypto.randomUUID();
            addNote({
                id: newId,
                courseId,
                title,
                content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            setSelectedNoteId(newId);
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this note?")) {
            deleteNote(id);
            if (selectedNoteId === id) {
                setSelectedNoteId(null);
                setIsEditing(false);
            }
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-2xl font-bold tracking-tight">Course Notes</h2>
                </div>
                <Button onClick={handleNewNote}>
                    <Plus className="mr-2 h-4 w-4" /> New Note
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Notes List Sidebar */}
                <div className="md:col-span-4 bg-muted/10 rounded-lg p-4 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-12rem)]">
                    {courseNotes.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8 text-sm">
                            No notes yet. Create one to get started.
                        </div>
                    ) : (
                        courseNotes.map(note => (
                            <div
                                key={note.id}
                                onClick={() => handleSelectNote(note.id)}
                                className={cn(
                                    "p-3 rounded-lg border cursor-pointer hover:bg-accent transition group relative",
                                    selectedNoteId === note.id ? "bg-accent border-primary" : "bg-card"
                                )}
                            >
                                <h3 className="font-medium truncate pr-6">{note.title}</h3>
                                <p className="text-xs text-muted-foreground truncate">{new Date(note.updatedAt).toLocaleDateString()}</p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                                    onClick={(e) => handleDelete(note.id, e)}
                                >
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                {/* Editor Area */}
                <div className="md:col-span-8 flex flex-col h-full">
                    {isEditing ? (
                        <Card className="flex-1 flex flex-col h-full">
                            <CardContent className="p-4 flex flex-col h-full gap-4">
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-lg font-bold border-none shadow-none focus-visible:ring-0 px-0"
                                    placeholder="Note Title..."
                                />
                                <div className="flex-1 overflow-hidden">
                                    <NoteEditor
                                        content={content}
                                        onChange={setContent}
                                        className="h-full border-none"
                                    />
                                </div>
                                <div className="flex justify-end pt-2 border-t">
                                    <Button onClick={handleSave}>
                                        <Save className="mr-2 h-4 w-4" /> Save Note
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                            Select a note or create a new one
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Utility to merge classnames from shadcn
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
