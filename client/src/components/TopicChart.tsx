import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TopicData {
  name: string;
  completed: number;
  total: number;
  percentage: number;
}

interface TopicChartProps {
  data: Record<string, { completed: number; total: number; percentage: number }>;
  className?: string;
}

export const TopicChart = ({ data, className = '' }: TopicChartProps) => {
  const chartData: TopicData[] = Object.entries(data).map(([name, stats]) => ({
    name,
    completed: stats.completed,
    total: stats.total,
    percentage: stats.percentage
  }));

  // Black and white color palette for topics
  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--muted))',
    'hsl(var(--accent))',
    'hsl(var(--border))',
    'hsl(var(--foreground))'
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3">
          <p className="font-light text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground font-light">
            {data.completed} / {data.total} completed
          </p>
          <p className="text-sm text-primary font-light">
            {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground truncate">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-card border border-border p-6 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-light text-foreground mb-2">
          Topic-wise Progress
        </h3>
        <p className="text-sm text-muted-foreground font-light">
          Completion percentage by topic
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="percentage"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};