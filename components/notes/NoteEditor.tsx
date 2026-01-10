"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Bold,
    Italic,
    List,
    Heading1,
    Heading2,
    Code,
    Quote,
    CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
    content: string;
    onChange: (content: string) => void;
    className?: string;
    placeholder?: string;
}

export function NoteEditor({ content, onChange, className, placeholder }: NoteEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);

    // Basic markdown insertion helper
    const insertMarkdown = (prefix: string, suffix: string = "") => {
        if (!textareaRef.current) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = textareaRef.current.value;

        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = `${before}${prefix}${selection}${suffix}${after}`;

        onChange(newText);

        // Restore focus and cursor
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newCursorPos = start + prefix.length + selection.length + suffix.length;
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Tab support
        if (e.key === 'Tab') {
            e.preventDefault();
            insertMarkdown("    ");
        }
    };

    return (
        <div className={cn("flex flex-col border rounded-md overflow-hidden bg-background", className)}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b bg-muted/30 overflow-x-auto">
                <ToolbarButton onClick={() => insertMarkdown("# ")} icon={<Heading1 className="h-4 w-4" />} title="Heading 1" />
                <ToolbarButton onClick={() => insertMarkdown("## ")} icon={<Heading2 className="h-4 w-4" />} title="Heading 2" />
                <div className="w-px h-4 bg-border mx-1" />
                <ToolbarButton onClick={() => insertMarkdown("**", "**")} icon={<Bold className="h-4 w-4" />} title="Bold" />
                <ToolbarButton onClick={() => insertMarkdown("*", "*")} icon={<Italic className="h-4 w-4" />} title="Italic" />
                <div className="w-px h-4 bg-border mx-1" />
                <ToolbarButton onClick={() => insertMarkdown("- ")} icon={<List className="h-4 w-4" />} title="List" />
                <ToolbarButton onClick={() => insertMarkdown("[ ] ")} icon={<CheckSquare className="h-4 w-4" />} title="Task" />
                <div className="w-px h-4 bg-border mx-1" />
                <ToolbarButton onClick={() => insertMarkdown("> ")} icon={<Quote className="h-4 w-4" />} title="Quote" />
                <ToolbarButton onClick={() => insertMarkdown("```\n", "\n```")} icon={<Code className="h-4 w-4" />} title="Code Block" />
            </div>

            {/* Editor Area */}
            <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Start typing your notes here... (Markdown supported)"}
                className="flex-1 min-h-[300px] border-0 rounded-none focus-visible:ring-0 resize-none p-4 font-mono text-sm leading-relaxed"
            />

            {/* Help hint */}
            <div className="px-4 py-2 text-xs text-muted-foreground border-t bg-muted/10">
                Markdown supported. Type # for heading, ** for bold, - for list.
            </div>
        </div>
    );
}

function ToolbarButton({ onClick, icon, title }: { onClick: () => void, icon: React.ReactNode, title: string }) {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="h-8 w-8 p-0 hover:bg-muted"
            title={title}
            type="button"
        >
            {icon}
        </Button>
    )
}
