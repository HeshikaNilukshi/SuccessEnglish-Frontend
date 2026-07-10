import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export interface AreaData {
  attemptId: number
  examTitle: string
  courseName: string
  score: number
  date: string
}

interface ResultsChartProps {
  data: AreaData[]
}

export function ResultsChart({ data }: ResultsChartProps) {
  return (
    <Card className="rounded-2xl glass-panel p-6 shadow-sm border-none ring-0 relative overflow-hidden">
      <CardHeader className="p-0 pb-6">
        <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
          Exam Performance Timeline
        </CardTitle>
        <CardDescription className="text-text-secondary text-sm">
          Progression of final marks.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 h-[400px] w-full">
        <ChartContainer
          config={{
            score: {
              label: "Score",
              color: "#2563eb"
            }
          }}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="examTitle"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                domain={[0, 100]}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value, payload) => {
                      const item = payload[0]?.payload
                      if (item) {
                        return (
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-text-primary">{item.examTitle}</span>
                            <span className="text-xs text-text-muted">{item.courseName}</span>
                          </div>
                        )
                      }
                      return value
                    }}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
