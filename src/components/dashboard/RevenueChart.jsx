'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border px-3 py-2">
      <p className="font-mono text-[10px] text-muted uppercase">{label}</p>
      <p className="font-display font-bold text-accent">{payload[0]?.value?.toFixed(0)}</p>
    </div>
  )
}

export default function RevenueChart({ data = [] }) {
  const max = Math.max(...data.map(d => d.revenue), 1)

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barCategoryGap="30%">
        <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(232,255,0,0.05)' }} />
        <Bar dataKey="revenue" radius={[2, 2, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.revenue === max ? '#E8FF00' : '#2A2A2A'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
