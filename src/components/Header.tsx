"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STEPS = [
  { href: "/profile", label: "Profile" },
  { href: "/interview", label: "Interview" },
  { href: "/results", label: "Feedback" },
];

export default function Header() {
  const pathname = usePathname();
  const current = STEPS.findIndex((s) => pathname.startsWith(s.href));

  return (
    <header className="border-b border-line/10">
      <div className="flex h-16 w-full items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md bg-accent font-display text-base font-bold text-accent-ink"
            aria-hidden
          >
            H
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">HireWise</span>
        </Link>

        {current >= 0 && (
          <ol className="hidden items-center gap-3 text-sm sm:flex" aria-label="Progress">
            {STEPS.map((s, i) => (
              <li key={s.href} className="flex items-center gap-3">
                <span
                  className={`flex items-center gap-2 ${
                    i === current ? "text-ink" : i < current ? "text-muted" : "text-muted/50"
                  }`}
                  aria-current={i === current ? "step" : undefined}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] tabular-nums ${
                      i === current
                        ? "border-accent bg-accent text-accent-ink"
                        : i < current
                          ? "border-line/30"
                          : "border-line/15"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <span className="h-px w-8 bg-line/15" aria-hidden />}
              </li>
            ))}
          </ol>
        )}
      </div>
    </header>
  );
}
