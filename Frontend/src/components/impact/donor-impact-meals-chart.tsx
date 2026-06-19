import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { donorImpactContent } from '../../placeholder/donor-impact-content'
import { cn } from '../../lib/utils'
import type { DonorImpactMonthlyPoint } from '../../types/donor-impact'

type DonorImpactMealsChartProps = {
  data: DonorImpactMonthlyPoint[]
  className?: string
}

export function DonorImpactMealsChart({
  data,
  className,
}: DonorImpactMealsChartProps) {
  return (
    <div
      aria-label={donorImpactContent.chart.ariaLabel}
      className={cn('h-72 min-h-[14rem] w-full sm:h-80', className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e4df" />
          <XAxis
            dataKey="monthLabel"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(27, 94, 63, 0.08)' }}
            formatter={(value) => [
              typeof value === 'number' ? value.toLocaleString() : '0',
              donorImpactContent.chart.legend,
            ]}
          />
          <Bar
            dataKey="meals"
            name={donorImpactContent.chart.legend}
            fill="#1B5E3F"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
