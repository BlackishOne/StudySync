"use client";

import { useStudyStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { RotateCw, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StudyModalProps {
    deckId: string;
    isOpen: boolean;
    onClose: () => void;
}

import { useStore } from "@/hooks/use-store";
import { useLanguage } from "@/contexts/LanguageContext";

export function FlashcardStudy({ deckId, isOpen, onClose }: StudyModalProps) {
    const { t } = useLanguage();

    // Store
    const decks = useStore(useStudyStore, (state) => state.decks) || [];
    const cards = useStore(useStudyStore, (state) => state.cards) || [];
    const updateCardProbability = useStudyStore((state) => state.updateCardProbability);
    const addXP = useStudyStore((state) => state.addXP);

    const deck = decks.find(d => d.id === deckId);
    // Determine cards to study (e.g., probability < 5 or older review?)
    // For simplicity with current types: all cards sorted by probability (ascending)
    const studyCards = cards
        .filter(c => c.deckId === deckId)
        .sort((a, b) => a.confidence - b.confidence);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);

    const currentCard = studyCards[currentIndex];

    // Reset when deck changes
    useEffect(() => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionComplete(false);
    }, [deckId, isOpen]);

    const handleNext = (confidenceRating: number) => {
        if (!currentCard) return;

        updateCardProbability(currentCard.id, confidenceRating);
        setIsFlipped(false);

        if (currentIndex < studyCards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setSessionComplete(true);
            addXP(50); // Award XP for session completion
        }
    };

    if (!deck) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{t.flashcards.study}: {deck.title}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col items-center justify-center relative perspective-1000">
                    {!sessionComplete && studyCards.length > 0 ? (
                        <div className="w-full max-w-md aspect-[3/2] relative cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                            <motion.div
                                className="w-full h-full relative preserve-3d transition-all duration-500"
                                initial={false}
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Front */}
                                <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 border-2 rounded-xl flex items-center justify-center p-8 text-center text-xl font-medium shadow-lg">
                                    {currentCard.front}
                                    <div className="absolute bottom-4 text-xs text-muted-foreground">{t.flashcards.studyMode.flip}</div>
                                </div>

                                {/* Back */}
                                <div
                                    className="absolute inset-0 backface-hidden bg-blue-50 dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-900 rounded-xl flex items-center justify-center p-8 text-center text-xl font-medium shadow-lg"
                                    style={{ transform: 'rotateY(180deg)' }}
                                >
                                    {currentCard.back}
                                </div>
                            </motion.div>
                        </div>
                    ) : sessionComplete ? (
                        <div className="text-center space-y-4 animate-in fade-in zoom-in">
                            <div className="text-4xl">🎉</div>
                            <h3 className="text-2xl font-bold">{t.flashcards.studyMode.complete}</h3>
                            <p className="text-muted-foreground">You earned 50 XP</p>
                            <Button onClick={onClose}>{t.flashcards.studyMode.close}</Button>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            {t.flashcards.empty}
                        </div>
                    )}
                </div>

                {/* Controls */}
                {!sessionComplete && studyCards.length > 0 && isFlipped && (
                    <div className="flex justify-center gap-4 mt-8 animate-in slide-in-from-bottom-4">
                        <Button variant="destructive" className="w-24" onClick={(e) => { e.stopPropagation(); handleNext(1); }}>
                            {t.flashcards.studyMode.again}
                        </Button>
                        <Button variant="secondary" className="w-24" onClick={(e) => { e.stopPropagation(); handleNext(3); }}>
                            {t.flashcards.studyMode.hard}
                        </Button>
                        <Button className="w-24 bg-green-600 hover:bg-green-700" onClick={(e) => { e.stopPropagation(); handleNext(5); }}>
                            {t.flashcards.studyMode.easy}
                        </Button>
                    </div>
                )}

                {!sessionComplete && studyCards.length > 0 && (
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Card {currentIndex + 1} of {studyCards.length}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
