"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="w-9 px-0"
        >
            <span className="font-bold text-xs">{language.toUpperCase()}</span>
        </Button>
    );
}
