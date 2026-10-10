'use client';
import { CandidateInfo } from '@/types';

const Row = ({ label, value, accent }: { label: string; value?: string; accent?: boolean }) => (
    <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
        <dt className="text-muted">{label}</dt>
        <dd className={`text-right font-medium ${accent ? 'text-accent' : ''}`}>{value}</dd>
    </div>
);

export default function CandidateSidebar({ info }: { info: CandidateInfo }) {
    return (
        <aside className="sticky top-6 h-fit rounded-2xl border border-line/10 bg-surface p-6">
            <h3 className="border-b border-line/10 pb-4 font-display text-lg font-semibold">Candidate profile</h3>

            <dl className="divide-y divide-line/10">
                <Row label="Name" value={info.name} />
                <Row label="Role" value={info.role} />
                <Row label="Tool" value={info.tool} accent />
                <Row label="Experience" value={info.experience} />
                <Row label="Current CTC" value={info.currentCTC} />
                <Row label="Expected CTC" value={info.expectedCTC} accent />
                <Row label="Relocation" value={info.relocation} />
                {info.datetime && <Row label="Date" value={new Date(info.datetime).toLocaleDateString()} />}
            </dl>
        </aside>
    );
}
