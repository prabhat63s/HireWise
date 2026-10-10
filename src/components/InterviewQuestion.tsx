'use client';
import { Question } from '@/types';

interface Props {
    question: Question;
    selectedOption: string;
    onSelectOption: (option: string) => void;
    notes: string;
    onNotesChange: (notes: string) => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function InterviewQuestion({ question, selectedOption, onSelectOption, notes, onNotesChange }: Props) {
    return (
        <section className="rounded-2xl border border-line/10 bg-surface p-6 md:p-10">
            <h1 className="font-display text-2xl font-medium leading-snug md:text-3xl">
                {question.question}
            </h1>

            <div role="radiogroup" aria-label="Answer options" className="mt-8 grid grid-cols-1 gap-3">
                {question.options.map((option, idx) => {
                    const selected = selectedOption === option;
                    return (
                        <button
                            key={idx}
                            role="radio"
                            aria-checked={selected}
                            onClick={() => onSelectOption(option)}
                            className={`flex w-full cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 text-left transition-colors
                                ${selected
                                    ? 'border-accent bg-accent/10 text-ink'
                                    : 'border-line/10 text-ink/80 hover:border-line/30'}
                            `}
                        >
                            <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border font-mono text-xs
                                    ${selected ? 'border-accent bg-accent text-accent-ink' : 'border-line/20 text-muted'}
                                `}
                            >
                                {LETTERS[idx] ?? idx + 1}
                            </span>
                            <span className="text-base">{option}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 border-t border-line/10 pt-6">
                <label htmlFor="rationale" className="label">
                    Your reasoning <span className="text-muted/60">(optional)</span>
                </label>
                <textarea
                    id="rationale"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Briefly explain why you chose this answer..."
                    className="field h-28 resize-none"
                />
            </div>
        </section>
    );
}
