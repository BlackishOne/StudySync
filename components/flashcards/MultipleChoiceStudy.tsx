"use client";

import { useStudyStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { useStore } from "@/hooks/use-store";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Flashcard } from "@/lib/types";

interface MultipleChoiceStudyProps {
    deckId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function MultipleChoiceStudy({ deckId, isOpen, onClose }: MultipleChoiceStudyProps) {
    const { t } = useLanguage();

    // Store
    const decks = useStore(useStudyStore, (state) => state.decks) || [];
    const cards = useStore(useStudyStore, (state) => state.cards) || [];
    const updateCardProbability = useStudyStore((state) => state.updateCardProbability);
    const addXP = useStudyStore((state) => state.addXP);

    const deck = decks.find(d => d.id === deckId);
    const studyCards = cards
        .filter(c => c.deckId === deckId)
        .sort((a, b) => a.confidence - b.confidence);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [score, setScore] = useState(0);

    const currentCard = studyCards[currentIndex];

    // Generate distractors (wrong answers)
    const generateDistractors = (correctAnswer: string, allCards: Flashcard[]): string[] => {
        // Get other cards' answers as distractors
        const otherAnswers = allCards
            .filter(c => c.id !== currentCard?.id && c.back !== correctAnswer)
            .map(c => c.back);

        // Shuffle and pick 3
        const shuffled = otherAnswers.sort(() => Math.random() - 0.5);
        const distractors = shuffled.slice(0, 3);

        // If not enough distractors, generate plausible alternatives
        while (distractors.length < 3) {
            distractors.push(`Not ${correctAnswer}`);
        }

        return distractors;
    };

    const [options, setOptions] = useState<string[]>([]);

    // Generate options when card changes
    useEffect(() => {
        if (currentCard) {
            const distractors = generateDistractors(currentCard.back, studyCards);
            const allOptions = [currentCard.back, ...distractors];
            // Shuffle options
            setOptions(allOptions.sort(() => Math.random() - 0.5));
        }
        setSelectedAnswer(null);
        setIsCorrect(null);
    }, [currentIndex, currentCard]);

    // Reset when modal opens
    useEffect(() => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setSessionComplete(false);
        setScore(0);
    }, [deckId, isOpen]);

    const handleSelectAnswer = (answer: string) => {
        if (selectedAnswer !== null) return; // Already selected

        setSelectedAnswer(answer);
        const correct = answer === currentCard.back;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (!currentCard) return;

        // Update confidence based on correctness
        updateCardProbability(currentCard.id, isCorrect ? 5 : 1);

        if (currentIndex < studyCards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setSessionComplete(true);
            // Award XP based on score
            const xpEarned = score * 10 + 50;
            addXP(xpEarned);
        }
    };

    if (!deck) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Multiple Choice: {deck.title}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col items-center justify-center relative">
                    {!sessionComplete && studyCards.length > 0 && currentCard ? (
                        <div className="w-full max-w-lg space-y-6">
                            {/* Question */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-8 text-center">
                                <h3 className="text-2xl font-bold mb-2">Question</h3>
                                <p className="text-xl">{currentCard.front}</p>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 gap-3">
                                <AnimatePresence mode="wait">
                                    {options.map((option, index) => {
                                        const isSelected = selectedAnswer === option;
                                        const isCorrectAnswer = option === currentCard.back;
                                        const showResult = selectedAnswer !== null;

                                        let variant = "outline" as const;
                                        let className = "w-full h-auto p-4 text-left justify-start";

                                        if (showResult) {
                                            if (isCorrectAnswer) {
                                                className += " bg-green-100 dark:bg-green-950/30 border-green-500 hover:bg-green-100 dark:hover:bg-green-950/30";
                                            } else if (isSelected && !isCorrectAnswer) {
                                                className += " bg-red-100 dark:bg-red-950/30 border-red-500 hover:bg-red-100 dark:hover:bg-red-950/30";
                                            }
                                        }

                                        return (
                                            <motion.div
                                                key={option}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Button
                                                    variant={variant}
                                                    className={className}
                                                    onClick={() => handleSelectAnswer(option)}
                                                    disabled={showResult}
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <span className="flex-1">{option}</span>
                                                        {showResult && isCorrectAnswer && (
                                                            <Check className="h-5 w-5 text-green-600" />
                                                        )}
                                                        {showResult && isSelected && !isCorrectAnswer && (
                                                            <X className="h-5 w-5 text-red-600" />
                                                        )}
                                                    </div>
                                                </Button>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            {/* Feedback */}
                            {selectedAnswer !== null && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center space-y-4"
                                >
                                    <div className={`text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                                    </div>
                                    <Button onClick={handleNext} className="w-full">
                                        {currentIndex < studyCards.length - 1 ? 'Next Question' : 'Finish'}
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    ) : sessionComplete ? (
                        <div className="text-center space-y-4 animate-in fade-in zoom-in">
                            <div className="text-6xl">🎯</div>
                            <h3 className="text-2xl font-bold">Session Complete!</h3>
                            <div className="text-xl">
                                Score: <span className="font-bold text-purple-600">{score}/{studyCards.length}</span>
                            </div>
                            <p className="text-muted-foreground">
                                You earned {score * 10 + 50} XP
                            </p>
                            <Button onClick={onClose}>Close</Button>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            No cards to study
                        </div>
                    )}
                </div>

                {/* Progress */}
                {!sessionComplete && studyCards.length > 0 && (
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Question {currentIndex + 1} of {studyCards.length}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
