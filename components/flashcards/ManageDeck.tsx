"use client";

import { useStudyStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Need to install textarea or use Input
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useStore } from "@/hooks/use-store";
import { useLanguage } from "@/contexts/LanguageContext";

interface ManageDeckProps {
    deckId: string;
}

export function ManageDeck({ deckId }: ManageDeckProps) {
    const { t } = useLanguage();

    // Store
    const deck = useStore(useStudyStore, (state) => state.decks.find(d => d.id === deckId));
    const allCards = useStore(useStudyStore, (state) => state.cards) || [];
    const deckCards = allCards.filter(c => c.deckId === deckId);

    const addCard = useStudyStore((state) => state.addCard);
    const deleteCard = useStudyStore((state) => state.deleteCard);

    // State
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addCard({
            id: crypto.randomUUID(),
            deckId,
            front,
            back,
            confidence: 0
        });
        setFront("");
        setBack("");
    };

    if (!deck) return null;

    return (
        <div className="space-y-6">
            <form onSubmit={handleAdd} className="space-y-4 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <h4 className="font-semibold text-sm">{t.flashcards.form.addCard}</h4>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label>{t.flashcards.form.front}</Label>
                        <Input value={front} onChange={e => setFront(e.target.value)} placeholder="Question or Term" required />
                    </div>
                    <div className="space-y-2">
                        <Label>{t.flashcards.form.back}</Label>
                        <Input value={back} onChange={e => setBack(e.target.value)} placeholder="Answer or Definition" required />
                    </div>
                </div>
                <Button type="submit" size="sm" variant="secondary" className="w-full">{t.flashcards.form.addCard}</Button>
            </form>

            <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t.flashcards.cards} ({deckCards.length})</h4>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                    {deckCards.map(card => (
                        <div key={card.id} className="flex justify-between items-start p-3 border rounded bg-white dark:bg-slate-900 text-sm">
                            <div className="grid gap-1 flex-1">
                                <span className="font-medium">{card.front}</span>
                                <span className="text-muted-foreground border-t pt-1 mt-1">{card.back}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 shrink-0 ml-2" onClick={() => deleteCard(card.id)}>
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                    {deckCards.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            {t.flashcards.empty}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
