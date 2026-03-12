import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface KPICardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  sparklineData?: Array<{ value: number }>
}

export function KPICard({
  title,
  value,
  change,
  icon,
  trend = 'up',
  sparklineData = [],
}: KPICardProps) {
  const isPositive = change >= 0
  const isTrendUp = trend === 'up'

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              isPositive 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            {isTrendUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>

        {/* Sparkline */}
        {sparklineData.length > 0 && (
          <div className="h-16 -mx-2 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#16a34a' : '#dc2626'}
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="text-xs text-muted-foreground pt-2">
          {isPositive ? '+' : ''}{change}% from last month
        </p>
      </CardContent>
    </Card>
  )
}
