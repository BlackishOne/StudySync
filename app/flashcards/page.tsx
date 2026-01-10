"use client";

import { useStudyStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, Play, Settings2, Trash2, Library, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ManageDeck } from "@/components/flashcards/ManageDeck";
import { FlashcardStudy } from "@/components/flashcards/FlashcardStudy";
import { StudyModeSelector } from "@/components/flashcards/StudyModeSelector";
import { MultipleChoiceStudy } from "@/components/flashcards/MultipleChoiceStudy";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStore } from "@/hooks/use-store";

export default function FlashcardsPage() {
    const { t } = useLanguage();

    // Store
    const decks = useStore(useStudyStore, (state) => state.decks) || [];
    const cards = useStore(useStudyStore, (state) => state.cards) || [];
    const courses = useStore(useStudyStore, (state) => state.courses) || [];
    const addDeck = useStudyStore((state) => state.addDeck);
    const deleteDeck = useStudyStore((state) => state.deleteDeck);

    // Create Deck State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newDeckTitle, setNewDeckTitle] = useState("");
    const [newDeckCourse, setNewDeckCourse] = useState("GENERAL");

    // Study State
    const [studyDeckId, setStudyDeckId] = useState<string | null>(null);
    const [showModeSelector, setShowModeSelector] = useState(false);
    const [studyMode, setStudyMode] = useState<'classic' | 'multiple_choice' | null>(null);

    // Manage State
    const [manageDeckId, setManageDeckId] = useState<string | null>(null);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        addDeck({
            id: crypto.randomUUID(),
            title: newDeckTitle,
            courseId: newDeckCourse === "GENERAL" ? "GENERAL" : newDeckCourse
        });
        setIsCreateOpen(false);
        setNewDeckTitle("");
        setNewDeckCourse("GENERAL");
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t.flashcards.title}</h2>
                    <p className="text-muted-foreground">{t.flashcards.manage || "Manage study decks"}</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> {t.flashcards.createDeck}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t.flashcards.form.title}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t.flashcards.form.deckName}</Label>
                                <Input value={newDeckTitle} onChange={e => setNewDeckTitle(e.target.value)} required placeholder={t.flashcards.form.deckNamePlaceholder} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.flashcards.form.course}</Label>
                                <Select value={newDeckCourse} onValueChange={setNewDeckCourse}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GENERAL">{t.tasks.form.noCourse}</SelectItem>
                                        {courses.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">{t.flashcards.form.save}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Deck Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map(deck => {
                    const cardCount = cards.filter(c => c.deckId === deck.id).length;
                    const course = courses.find(c => c.id === deck.courseId);

                    return (
                        <div key={deck.id} className="group relative bg-white dark:bg-slate-900 border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <Library className="h-6 w-6" />
                                </div>
                                <div className="flex gap-1">
                                    <Dialog open={manageDeckId === deck.id} onOpenChange={(o) => setManageDeckId(o ? deck.id : null)}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                <Settings2 className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>{t.flashcards.manage}: {deck.title}</DialogTitle>
                                            </DialogHeader>
                                            <ManageDeck deckId={deck.id} />
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500/50 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10" onClick={() => deleteDeck(deck.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg mb-1">{deck.title}</h3>
                            <div className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
                                {course && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800">{course.name}</span>}
                                <span>• {cardCount} {t.flashcards.cards}</span>
                            </div>

                            <Button className="w-full" onClick={() => {
                                setStudyDeckId(deck.id);
                                setShowModeSelector(true);
                            }} disabled={cardCount === 0}>
                                <Play className="mr-2 h-4 w-4" /> {t.flashcards.study}
                            </Button>
                        </div>
                    );
                })}

                {decks.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                        <BookOpen className="h-12 w-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">{t.flashcards.empty}</h3>
                        <Button variant="link" onClick={() => setIsCreateOpen(true)}>{t.flashcards.createDeck}</Button>
                    </div>
                )}
            </div>

            {/* Study Mode Selector */}
            <StudyModeSelector
                isOpen={showModeSelector}
                onSelect={(mode) => {
                    setStudyMode(mode);
                    setShowModeSelector(false);
                }}
                onClose={() => {
                    setShowModeSelector(false);
                    setStudyDeckId(null);
                    setStudyMode(null);
                }}
            />

            {/* Classic Study Modal */}
            {studyDeckId && studyMode === 'classic' && (
                <FlashcardStudy
                    deckId={studyDeckId}
                    isOpen={true}
                    onClose={() => {
                        setStudyDeckId(null);
                        setStudyMode(null);
                    }}
                />
            )}

            {/* Multiple Choice Study Modal */}
            {studyDeckId && studyMode === 'multiple_choice' && (
                <MultipleChoiceStudy
                    deckId={studyDeckId}
                    isOpen={true}
                    onClose={() => {
                        setStudyDeckId(null);
                        setStudyMode(null);
                    }}
                />
            )}
        </div>
    );
}
