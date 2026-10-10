'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/store/interviewStore';
import TimeChart from '@/components/charts/TimeChart';
import PieChart from '@/components/charts/PieChart';
import ScatterChart from '@/components/charts/ScatterChart';
import { Download, RefreshCw, CheckCircle, AlertTriangle, Lightbulb, Loader2, Trophy, Target, Clock, Activity } from 'lucide-react';
import { AnalyticsData } from '@/types';
import { generatePDF } from '@/lib/pdf';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResultsPage() {
    const router = useRouter();
    const store = useInterviewStore();
    const {
        candidateInfo,
        questions,
        answers,
        times,
        notes,
        resetSession
    } = store;

    const [analytics, setAnalytics] = useState<AnalyticsData['notes_analysis']>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!candidateInfo) {
            router.push('/profile');
            return;
        }

        const fetchAnalytics = async () => {
            try {
                const response = await fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        notes: notes,
                        role: candidateInfo.role
                    })
                });

                const data = await response.json();
                setAnalytics(data.analysis);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [candidateInfo, notes, router]);

    if (!candidateInfo) return null;

    const correctCount = questions.reduce((acc, q, i) =>
        acc + (answers[i] === q.correct_answer ? 1 : 0), 0);
    const score = (correctCount / questions.length) * 100;
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const totalTime = times.reduce((a, b) => a + b, 0);

    const scatterData = questions.map((q, i) => ({
        question: `Q${i + 1}`,
        time: parseFloat(times[i].toFixed(1)),
        isCorrect: answers[i] === q.correct_answer
    }));

    const downloadPDF = () => {
        generatePDF(
            candidateInfo,
            score,
            questions,
            correctCount,
            avgTime,
            totalTime,
            analytics
        );
    };

    const metrics = [
        { label: "Score", value: `${score.toFixed(0)}%`, icon: Trophy },
        { label: "Correct answers", value: `${correctCount}/${questions.length}`, icon: Target },
        { label: "Average time", value: `${avgTime.toFixed(1)}s`, icon: Clock },
        { label: "Total time", value: `${Math.floor(totalTime / 60)}m ${Math.floor(totalTime % 60)}s`, icon: Activity },
    ];

    return (
        <div className="w-full px-6 py-10 md:px-10 md:py-14">
            <div className="space-y-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
                >
                    <div>
                        <p className="text-sm text-accent">Interview complete</p>
                        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                            Feedback for {candidateInfo.name}
                        </h1>
                        <p className="mt-3 text-muted">
                            {candidateInfo.role}{candidateInfo.tool ? ` · ${candidateInfo.tool}` : ''}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={downloadPDF}
                            className="btn-primary h-11 cursor-pointer px-5"
                        >
                            <Download className="h-4 w-4" />
                            Download report
                        </button>
                        <button
                            onClick={() => { resetSession(); router.push('/'); }}
                            className="btn-ghost h-11 cursor-pointer px-5"
                        >
                            <RefreshCw className="h-4 w-4" />
                            New session
                        </button>
                    </div>
                </motion.div>

                {/* Key numbers */}
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 lg:grid-cols-4">
                    {metrics.map((metric) => (
                        <div key={metric.label} className="bg-surface p-6">
                            <metric.icon className="mb-4 h-4 w-4 text-accent" />
                            <p className="text-sm text-muted">{metric.label}</p>
                            <p className="mt-1 font-display text-3xl font-semibold tabular-nums md:text-4xl">{metric.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <section className="rounded-2xl border border-line/10 bg-surface p-6 lg:col-span-8">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="font-display text-lg font-semibold">Response time</h3>
                            <span className="text-sm text-muted">Seconds per question</span>
                        </div>
                        <div className="h-[320px] w-full">
                            <TimeChart times={times} />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-line/10 bg-surface p-6 lg:col-span-4">
                        <h3 className="mb-6 font-display text-lg font-semibold">Results</h3>
                        <div className="flex h-[320px] w-full items-center justify-center">
                            <PieChart correct={correctCount} incorrect={questions.length - correctCount} />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-line/10 bg-surface p-6 lg:col-span-12">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="font-display text-lg font-semibold">Time vs. correctness</h3>
                            <div className="flex gap-5 text-sm text-muted">
                                <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-good" /> Correct
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-bad" /> Incorrect
                                </span>
                            </div>
                        </div>
                        <div className="h-[320px] w-full">
                            <ScatterChart data={scatterData} />
                        </div>
                    </section>
                </div>

                {/* AI feedback */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-line/10 bg-surface py-20"
                            role="status"
                        >
                            <Loader2 className="h-8 w-8 animate-spin text-accent" />
                            <div className="text-center">
                                <p className="font-display text-xl font-medium">Writing your feedback...</p>
                                <p className="mt-1 text-sm text-muted">Analyzing your answers and reasoning.</p>
                            </div>
                        </motion.div>
                    ) : analytics ? (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
                        >
                            <section className="rounded-2xl border border-line/10 bg-surface p-6 md:p-8">
                                <h3 className="flex items-center gap-3 font-display text-xl font-semibold">
                                    <CheckCircle className="h-5 w-5 text-good" /> Strengths
                                </h3>
                                <ul className="mt-5 space-y-3">
                                    {analytics.strengths.map((s, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-ink/85">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-good" aria-hidden />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="rounded-2xl border border-line/10 bg-surface p-6 md:p-8">
                                <h3 className="flex items-center gap-3 font-display text-xl font-semibold">
                                    <AlertTriangle className="h-5 w-5 text-bad" /> Areas to improve
                                </h3>
                                <ul className="mt-5 space-y-3">
                                    {analytics.areas_of_improvement.map((s, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-ink/85">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bad" aria-hidden />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="rounded-2xl border border-line/10 bg-surface p-6 md:p-8 lg:col-span-2">
                                <h3 className="flex items-center gap-3 font-display text-xl font-semibold">
                                    <Lightbulb className="h-5 w-5 text-accent" /> Recommendations
                                </h3>
                                <ol className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {analytics.recommendations.map((s, i) => (
                                        <li key={i} className="rounded-xl bg-raised p-5">
                                            <span className="font-mono text-xs text-accent tabular-nums">0{i + 1}</span>
                                            <p className="mt-2 text-sm leading-relaxed text-ink/85">{s}</p>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
}
