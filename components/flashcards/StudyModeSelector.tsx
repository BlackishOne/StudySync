"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RotateCw, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface StudyModeSelectorProps {
    isOpen: boolean;
    onSelect: (mode: 'classic' | 'multiple_choice') => void;
    onClose: () => void;
}

export function StudyModeSelector({ isOpen, onSelect, onClose }: StudyModeSelectorProps) {
    const modes = [
        {
            id: 'classic' as const,
            icon: RotateCw,
            title: 'Classic Mode',
            titleFr: 'Mode Classique',
            description: 'Flip cards and self-assess',
            descriptionFr: 'Retourner les cartes et auto-évaluer',
            color: 'from-blue-500 to-indigo-600'
        },
        {
            id: 'multiple_choice' as const,
            icon: Brain,
            title: 'Multiple Choice',
            titleFr: 'Choix Multiples',
            description: 'Pick the right answer',
            descriptionFr: 'Choisir la bonne réponse',
            color: 'from-purple-500 to-pink-600'
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Choose Study Mode</DialogTitle>
                    <p className="text-center text-muted-foreground mt-2">Select how you want to study</p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {modes.map((mode, index) => {
                        const Icon = mode.icon;
                        return (
                            <motion.div
                                key={mode.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Button
                                    variant="outline"
                                    className="w-full h-auto p-6 flex flex-col items-center gap-4 hover:border-primary transition-all group relative overflow-hidden"
                                    onClick={() => onSelect(mode.id)}
                                >
                                    {/* Gradient Background on Hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                    {/* Icon */}
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${mode.color} group-hover:scale-110 transition-transform`}>
                                        <Icon className="h-8 w-8 text-white" strokeWidth={2} />
                                    </div>

                                    {/* Text */}
                                    <div className="text-center relative z-10">
                                        <h3 className="text-lg font-bold mb-1">{mode.title}</h3>
                                        <p className="text-sm text-muted-foreground">{mode.description}</p>
                                    </div>
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    <span>Both modes earn XP and track progress</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
