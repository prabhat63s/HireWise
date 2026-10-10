'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/store/interviewStore';
import { TECH_ROLES } from '@/lib/constants';
import { Loader2, Clock, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import InterviewQuestion from '@/components/InterviewQuestion';

export default function InterviewPage() {
    const router = useRouter();
    const store = useInterviewStore();
    const {
        candidateInfo,
        questions,
        currentQuestionIndex,
        setQuestions,
        addAnswer,
        nextQuestion,
        setStartTime,
        startTime,
        suggestedDifficulty,
        recommendedLanguages
    } = store;

    const [selectedTool, setSelectedTool] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [notes, setNotes] = useState('');

    // Redirect if no profile
    useEffect(() => {
        if (!candidateInfo) {
            router.push('/profile');
        }
    }, [candidateInfo, router]);

    // Set default tool
    useEffect(() => {
        if (candidateInfo && !selectedTool) {
            const roleInfo = TECH_ROLES[candidateInfo.role];
            if (roleInfo) {
                const defaultTool = roleInfo.languages.find(l => recommendedLanguages.includes(l)) || roleInfo.languages[0];
                setSelectedTool(defaultTool);
            }
        }
    }, [candidateInfo, recommendedLanguages, selectedTool]);

    const handleStartInterview = async () => {
        if (!selectedTool) return;
        setIsGenerating(true);

        try {
            store.setCandidateInfo({ ...candidateInfo!, tool: selectedTool });

            const response = await fetch('/api/generate-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: selectedTool,
                    difficulty: suggestedDifficulty
                })
            });

            if (!response.ok) throw new Error('Failed to generate questions');

            const data = await response.json();
            setQuestions(data.questions);
            setStartTime(Date.now());
        } catch (error) {
            console.error(error);
            alert('Failed to generate questions');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNextQuestion = () => {
        if (!selectedOption) return;

        const timeTaken = (Date.now() - (startTime || Date.now())) / 1000;
        addAnswer(selectedOption, timeTaken, notes);

        setNotes('');
        setSelectedOption('');
        setStartTime(Date.now());

        if (currentQuestionIndex < questions.length - 1) {
            nextQuestion();
        } else {
            router.push('/results');
        }
    };

    if (!candidateInfo) return null;

    // Configuration View
    if (questions.length === 0) {
        const roleInfo = TECH_ROLES[candidateInfo.role];

        return (
            <div className="w-full px-6 py-10 md:px-10 md:py-14">
                <header className="rise mb-10 max-w-2xl">
                    <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Choose your stack</h1>
                    <p className="mt-3 text-muted">
                        Pick the technology you want to be assessed on. Questions are generated for it.
                    </p>
                </header>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    {/* Tool Selection */}
                    <section className="rounded-2xl border border-line/10 bg-surface p-6 md:p-8 lg:col-span-7">
                        <h2 className="font-display text-lg font-semibold">Tech stack</h2>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {roleInfo?.languages.map((tool) => (
                                <button
                                    key={tool}
                                    onClick={() => setSelectedTool(tool)}
                                    aria-pressed={selectedTool === tool}
                                    className={`cursor-pointer rounded-xl border p-5 text-left transition-colors
                                        ${selectedTool === tool
                                            ? 'border-accent bg-accent/10'
                                            : 'border-line/10 hover:border-line/30'}
                                    `}
                                >
                                    <span className="block font-medium">{tool}</span>
                                    {recommendedLanguages.includes(tool) && (
                                        <span className="mt-1 flex items-center gap-1 text-xs text-accent">
                                            <Zap className="h-3 w-3" /> Recommended from your CV
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Summary & Start */}
                    <section className="space-y-6 rounded-2xl border border-line/10 bg-surface p-6 md:p-8 lg:col-span-5">
                        <dl className="space-y-5">
                            <div>
                                <dt className="text-sm text-muted">Target role</dt>
                                <dd className="mt-1 font-display text-xl font-medium">{candidateInfo.role}</dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted">Difficulty</dt>
                                <dd className="mt-2 flex items-center gap-3">
                                    <span className={`rounded-full border px-3 py-1 text-sm font-medium
                                        ${suggestedDifficulty === 'Hard' ? 'border-bad/40 bg-bad/10 text-bad' :
                                            suggestedDifficulty === 'Medium' ? 'border-amber-400/40 bg-amber-400/10 text-amber-300' :
                                                'border-good/40 bg-good/10 text-good'}
                                    `}>
                                        {suggestedDifficulty}
                                    </span>
                                    <span className="text-sm text-muted">Suggested from your CV</span>
                                </dd>
                            </div>
                        </dl>

                        <p className="rounded-lg bg-raised p-4 text-sm leading-relaxed text-muted">
                            10 multiple-choice questions on <span className="text-ink">{selectedTool || 'your selected tool'}</span>.
                            You can add a short rationale to each answer.
                        </p>

                        <button
                            onClick={handleStartInterview}
                            disabled={isGenerating || !selectedTool}
                            className="btn-primary h-12 w-full cursor-pointer text-base"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Generating questions...
                                </>
                            ) : (
                                <>
                                    Start interview
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </section>
                </div>
            </div>
        );
    }

    // Interview View
    const question = questions[currentQuestionIndex];

    return (
        <div className="mx-auto w-full max-w-4xl px-6 py-10 md:py-14">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <p className="text-sm text-muted">Question</p>
                        <h2 className="font-display text-4xl font-semibold tabular-nums">
                            {currentQuestionIndex + 1}
                            <span className="text-muted/60"> / 10</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                        <Clock className="h-4 w-4" />
                        <span className="font-mono text-lg tabular-nums text-ink">
                            {startTime ? Math.floor((Date.now() - startTime) / 1000) : 0}s
                        </span>
                    </div>
                </div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-line/10">
                    <motion.div
                        className="h-full rounded-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <InterviewQuestion
                    question={question}
                    selectedOption={selectedOption}
                    onSelectOption={setSelectedOption}
                    notes={notes}
                    onNotesChange={setNotes}
                />
            </motion.div>

            {/* Footer */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleNextQuestion}
                    disabled={!selectedOption}
                    className="btn-primary h-12 cursor-pointer px-7 text-base"
                >
                    {currentQuestionIndex < 9 ? "Next question" : "Submit interview"}
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
