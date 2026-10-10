'use client';
import { ScatterChart as ReScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts';

export default function ScatterChart({ data }: { data: { question: string, time: number, isCorrect: boolean }[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ReScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
                <XAxis
                    dataKey="question"
                    type="category"
                    allowDuplicatedCategory={false}
                    tick={{ fill: '#9a9a94', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    dataKey="time"
                    type="number"
                    name="Time"
                    unit="s"
                    tick={{ fill: '#9a9a94', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                />
                <ZAxis type="number" range={[90, 90]} />
                <Tooltip
                    cursor={{ strokeDasharray: '3 3', stroke: '#ffffff20' }}
                    contentStyle={{
                        backgroundColor: '#202022',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                        padding: '10px 12px',
                        color: '#ededea',
                        fontSize: '13px'
                    }}
                />
                <Scatter name="Performance" data={data} animationDuration={800}>
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.isCorrect ? '#5fd08a' : '#f2736b'}
                        />
                    ))}
                </Scatter>
            </ReScatterChart>
        </ResponsiveContainer>
    );
}
