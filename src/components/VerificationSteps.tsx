'use client';

import { Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const STEPS = [
    "Verifying Profile",
    "Analyzing Experience",
    "Identifying Key Skills",
    "Finalizing Interview Setup"
];

export default function VerificationSteps({ onComplete }: { onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < STEPS.length) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            onComplete();
        }
    }, [currentStep, onComplete]);

    return (
        <section className="rounded-2xl border border-line/10 bg-surface p-6">
            <h3 className="font-display text-lg font-semibold">Profile analysis</h3>
            <p className="mt-0.5 text-sm text-muted">Reviewing your CV before the interview.</p>

            <ol className="mt-5 space-y-3">
                {STEPS.map((step, index) => (
                    <li key={step} className="flex items-center gap-3 text-sm">
                        <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${index < currentStep
                                ? 'border-good bg-good text-bg'
                                : index === currentStep
                                    ? 'border-accent text-accent'
                                    : 'border-line/20 text-transparent'
                                }`}
                        >
                            {index < currentStep ? (
                                <Check className="h-3 w-3" strokeWidth={3} />
                            ) : index === currentStep ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : null}
                        </span>
                        <span className={index <= currentStep ? 'text-ink' : 'text-muted/60'}>{step}</span>
                        {index < currentStep && <span className="ml-auto text-xs text-good">Done</span>}
                    </li>
                ))}
            </ol>
        </section>
    );
}
