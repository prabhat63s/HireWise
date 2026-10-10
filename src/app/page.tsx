'use client';

import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/store/interviewStore';
import { ArrowRight, FileSearch, GitBranch, LineChart, Check } from 'lucide-react';

const FEATURES = [
  {
    icon: FileSearch,
    title: 'Smart CV screening',
    desc: 'Upload a CV and HireWise reads it for you: detected role, years of experience and the stack the candidate actually works in.',
  },
  {
    icon: GitBranch,
    title: 'Adaptive technical questions',
    desc: 'Questions are generated for the candidate\u2019s language and seniority, so every interview starts at the right difficulty.',
  },
  {
    icon: LineChart,
    title: 'Clear, comparable feedback',
    desc: 'Scores, response times and written strengths and growth areas, ready to download as a PDF report.',
  },
];

const STACKS = ['Rust', 'Go', 'Python', 'React', 'AWS', 'Kubernetes', 'AI / ML'];

const SAMPLE_OPTIONS = [
  'Wrap the update in a sync.Mutex',
  'Increase the channel buffer size',
  'Call runtime.Gosched() before writing',
  'Mark the counter as volatile',
];

export default function WelcomePage() {
  const router = useRouter();
  const resetSession = useInterviewStore((state) => state.resetSession);
  const handleStart = () => {
    resetSession();
    router.push('/profile');
  };

  return (
    <div>
      {/* hero */}
      <section className="grid w-full items-center gap-14 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.1fr_1fr]">
        <div className="rise">
          <p className="mb-5 text-sm font-medium text-accent">Engineering hiring, automated</p>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            Next-gen hiring starts here.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            From smart CV screening to adaptive technical questions that react to candidates in real
            time, HireWise automates the hardest parts of engineering recruitment.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <button onClick={handleStart} className="btn-primary h-12 cursor-pointer px-6 text-base">
              Start an interview
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted">Takes about 15 minutes</span>
          </div>
        </div>

        {/* sample question */}
        <div className="rise lg:justify-self-end" style={{ animationDelay: '0.12s' }}>
          <div className="w-full max-w-xl rounded-2xl border border-line/10 bg-surface p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] md:p-8">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">
                Question <span className="tabular-nums text-ink">4</span> of 10
              </span>
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">Sample</span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-line/10">
              <div className="h-full w-[40%] rounded-full bg-accent" />
            </div>

            <p className="mt-6 font-display text-xl font-medium leading-snug">
              Two goroutines increment a shared counter and the final value is sometimes wrong. What is the safest fix?
            </p>

            <ul className="mt-5 space-y-2.5">
              {SAMPLE_OPTIONS.map((opt, i) => (
                <li
                  key={opt}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
                    i === 0 ? 'border-accent/70 bg-accent/10 text-ink' : 'border-line/10 text-muted'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      i === 0 ? 'border-accent bg-accent text-accent-ink' : 'border-line/25'
                    }`}
                  >
                    {i === 0 && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="border-t border-line/10">
        <div className="grid w-full gap-px bg-line/10 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-bg px-6 py-10 md:px-10">
              <f.icon className="mb-5 h-5 w-5 text-accent" />
              <h3 className="font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* stacks */}
      <section className="border-t border-line/10 px-6 py-10 md:px-10">
        <p className="mb-4 text-sm text-muted">Question sets for</p>
        <ul className="flex flex-wrap gap-2">
          {STACKS.map((s) => (
            <li key={s} className="rounded-md border border-line/10 px-3 py-1.5 text-sm text-muted">
              {s}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
