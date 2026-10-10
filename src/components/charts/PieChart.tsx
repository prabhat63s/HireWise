'use client';
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function PieChart({ correct, incorrect }: { correct: number, incorrect: number }) {
    const data = [
        { name: 'Correct', value: correct },
        { name: 'Incorrect', value: incorrect },
    ];
    const COLORS = ['#5fd08a', '#f2736b'];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    animationDuration={800}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#202022',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                        padding: '10px 12px',
                        color: '#ededea',
                        fontSize: '13px'
                    }}
                    itemStyle={{ color: '#ededea', fontSize: '13px' }}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="ml-1 text-sm text-muted">{value}</span>}
                />
            </RePieChart>
        </ResponsiveContainer>
    );
}
