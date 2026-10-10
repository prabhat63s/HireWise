'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TimeChart({ times }: { times: number[] }) {
    const data = times.map((t, i) => ({ name: `Q${i + 1}`, time: parseFloat(t.toFixed(1)) }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
                <XAxis
                    dataKey="name"
                    tick={{ fill: '#9a9a94', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: '#9a9a94', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    unit="s"
                />
                <Tooltip
                    cursor={{ fill: '#ffffff08' }}
                    contentStyle={{
                        backgroundColor: '#202022',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                        padding: '10px 12px',
                        color: '#ededea',
                        fontSize: '13px'
                    }}
                    itemStyle={{ color: '#ff7a45', fontSize: '13px' }}
                />
                <Bar
                    dataKey="time"
                    fill="#ff7a45"
                    radius={[4, 4, 0, 0]}
                    name="Time (s)"
                    animationDuration={800}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
