import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ADMIN_REPORTS_CHART_BAR_FILL,
  ADMIN_REPORTS_CHART_GRID_STROKE,
} from '../../constants/admin-reports'
import { adminReportsContent } from '../../placeholder/admin-reports-content'
import { cn } from '../../lib/utils'
import type { AdminReportsMealsByDayOfWeek } from '../../types/admin-reports'

type AdminReportsMealsByDayChartProps = {
  data: AdminReportsMealsByDayOfWeek[]
  className?: string
}

export function AdminReportsMealsByDayChart({
  data,
  className,
}: AdminReportsMealsByDayChartProps) {
  const { mealsByDayOfWeek } = adminReportsContent.charts

  return (
    <article className="border-border flex min-h-[22rem] flex-col rounded-2xl border bg-white p-5 shadow-sm sm:min-h-[24rem] sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-charcoal font-display text-lg font-bold">
          {mealsByDayOfWeek.title}
        </h2>
        <div className="text-body flex items-center gap-2 text-xs">
          <span
            aria-hidden="true"
            className="bg-primary size-3 rounded-sm"
          />
          <span>{mealsByDayOfWeek.legend}</span>
        </div>
      </div>

      <div
        aria-label={mealsByDayOfWeek.ariaLabel}
        className={cn('min-h-0 flex-1', className)}
      >
        <ResponsiveContainer width="100%" height="100%" minHeight={224}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={ADMIN_REPORTS_CHART_GRID_STROKE}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: 'var(--color-body)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: 'var(--color-body)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }}
              formatter={(value) => [
                typeof value === 'number' ? value.toLocaleString() : '0',
                mealsByDayOfWeek.legend,
              ]}
            />
            <Bar
              dataKey="meals"
              name={mealsByDayOfWeek.legend}
              fill={ADMIN_REPORTS_CHART_BAR_FILL}
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
