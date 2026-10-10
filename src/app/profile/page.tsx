'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/store/interviewStore';
import { TECH_ROLES, CTC_RANGES } from '@/lib/constants';
import VerificationSteps from '@/components/VerificationSteps';
import { Upload, Check, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisResult {
    candidate_name: string;
    suggested_role: string;
    years_of_experience: string;
    confidence: number;
    recommended_languages: string[];
}

export default function ProfilePage() {
    const router = useRouter();
    const {
        candidateInfo,
        setCandidateInfo,
        setSuggestedDifficulty,
        setRecommendedLanguages
    } = useInterviewStore();

    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isVerified, setIsVerified] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            const response = await fetch('/api/cv-analyze', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setAnalysisResult(data);
            setCandidateInfo({
                name: data.candidate_name,
                role: data.suggested_role,
                experience: data.years_of_experience,
                currentCTC: '',
                expectedCTC: '',
                relocation: 'No'
            });
            setSuggestedDifficulty(data.confidence > 0.8 ? 'Hard' : data.confidence > 0.5 ? 'Medium' : 'Easy');
            setRecommendedLanguages(data.recommended_languages);
        } catch (error) {
            console.error('Analysis failed', error);
        } finally {
            setIsAnalyzing(false);
        }
    }, [setCandidateInfo, setSuggestedDifficulty, setRecommendedLanguages]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/interview');
    };

    return (
        <div className="w-full px-6 py-10 md:px-10 md:py-14">
            <header className="rise mb-10 max-w-2xl">
                <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Interview setup</h1>
                <p className="mt-3 text-muted">
                    Upload a CV and confirm the details. HireWise uses them to choose the role, stack and difficulty.
                </p>
            </header>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">

                {/* Left Column: Data Input & Analysis */}
                <div className="space-y-6 lg:col-span-7">
                    {/* Upload Zone */}
                    <div
                        {...getRootProps()}
                        className={`relative cursor-pointer overflow-hidden rounded-2xl border border-dashed bg-surface p-10 transition-colors
                            ${isDragActive ? 'border-accent bg-accent/5' : 'border-line/20 hover:border-line/40'}
                            ${file ? 'border-solid border-line/20' : ''}
                        `}
                    >
                        <input {...getInputProps()} aria-label="Upload CV" />

                        {isAnalyzing && (
                            <motion.div
                                initial={{ top: 0 }}
                                animate={{ top: '100%' }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 z-20 h-px bg-accent"
                            />
                        )}

                        <div className="flex items-center gap-5">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border
                                ${file && !isAnalyzing ? 'border-good/40 bg-good/10 text-good' : 'border-line/15 text-muted'}
                            `}>
                                {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> :
                                    file ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                            </div>

                            <div className="min-w-0">
                                <h3 className="truncate font-medium">
                                    {file ? file.name : "Upload CV (PDF)"}
                                </h3>
                                <p className="mt-0.5 text-sm text-muted">
                                    {isAnalyzing ? "Analyzing the profile..." : file ? "Click or drop to replace" : "Drag and drop, or click to browse. PDF works best."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Results */}
                    <AnimatePresence>
                        {analysisResult && (
                            <motion.section
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl border border-line/10 bg-surface p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display text-lg font-semibold">What we found</h3>
                                    <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent tabular-nums">
                                        {(analysisResult.confidence * 100).toFixed(0)}% match
                                    </span>
                                </div>

                                <dl className="mt-5 grid grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-sm text-muted">Detected role</dt>
                                        <dd className="mt-1 font-medium">{analysisResult.suggested_role}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-muted">Experience</dt>
                                        <dd className="mt-1 font-medium">{analysisResult.years_of_experience}</dd>
                                    </div>
                                </dl>

                                <div className="mt-6">
                                    <p className="text-sm text-muted">Technical stack</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {analysisResult.recommended_languages.map((lang: string) => (
                                            <span key={lang} className="rounded-md border border-line/10 bg-raised px-2.5 py-1 text-sm">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>

                    {/* Verification Steps */}
                    {file && !isAnalyzing && (
                        <VerificationSteps onComplete={() => setIsVerified(true)} />
                    )}
                </div>

                {/* Right Column: Additional Parameters */}
                <div className="lg:col-span-5">
                    <div className="space-y-4 lg:sticky lg:top-6">
                        <form onSubmit={handleFormSubmit} className="space-y-6 rounded-2xl border border-line/10 bg-surface p-6 md:p-8">
                            <h2 className="font-display text-lg font-semibold">Candidate details</h2>

                            <div>
                                <label htmlFor="name" className="label">Full name</label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={candidateInfo?.name || ''}
                                    onChange={(e) => setCandidateInfo({ ...candidateInfo!, name: e.target.value })}
                                    className="field"
                                    placeholder="Candidate name"
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="label">Target role</label>
                                <select
                                    id="role"
                                    required
                                    value={candidateInfo?.role || ''}
                                    onChange={(e) => setCandidateInfo({ ...candidateInfo!, role: e.target.value })}
                                    className="field"
                                >
                                    {Object.keys(TECH_ROLES).map(role => (
                                        <option key={role} value={role} className="bg-surface">{role}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="current-ctc" className="label">Current CTC</label>
                                    <select
                                        id="current-ctc"
                                        required
                                        value={candidateInfo?.currentCTC || ''}
                                        onChange={(e) => setCandidateInfo({ ...candidateInfo!, currentCTC: e.target.value })}
                                        className="field"
                                    >
                                        <option value="" className="bg-surface">Select</option>
                                        {CTC_RANGES.map(range => <option key={range} value={range} className="bg-surface">{range}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="expected-ctc" className="label">Expected CTC</label>
                                    <select
                                        id="expected-ctc"
                                        required
                                        value={candidateInfo?.expectedCTC || ''}
                                        onChange={(e) => setCandidateInfo({ ...candidateInfo!, expectedCTC: e.target.value })}
                                        className="field"
                                    >
                                        <option value="" className="bg-surface">Select</option>
                                        {CTC_RANGES.map(range => <option key={range} value={range} className="bg-surface">{range}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <span className="label">Relocation</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Yes', 'No', 'Remote Only'].map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setCandidateInfo({ ...candidateInfo!, relocation: option })}
                                            aria-pressed={candidateInfo?.relocation === option}
                                            className={`cursor-pointer rounded-lg border py-2.5 text-sm transition-colors
                                                ${candidateInfo?.relocation === option
                                                    ? 'border-accent bg-accent/10 text-ink'
                                                    : 'border-line/12 text-muted hover:border-line/30 hover:text-ink'}
                                            `}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!isVerified}
                                className="btn-primary h-12 w-full cursor-pointer text-base"
                            >
                                Continue to assessment
                                <ArrowRight className="h-4 w-4" />
                            </button>
                            {!isVerified && (
                                <p className="-mt-2 text-center text-xs text-muted">Upload a CV to unlock the next step.</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
