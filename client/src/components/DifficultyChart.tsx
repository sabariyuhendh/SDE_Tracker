import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface DifficultyChartProps {
  data: Record<string, number>;
  className?: string;
}

export const DifficultyChart = ({ data, className = '' }: DifficultyChartProps) => {
  const chartData = [
    { 
      name: 'Easy', 
      count: data.Easy || 0,
      color: 'hsl(var(--success))'
    },
    { 
      name: 'Medium', 
      count: data.Medium || 0,
      color: 'hsl(var(--warning))'
    },
    { 
      name: 'Hard', 
      count: data.Hard || 0,
      color: 'hsl(var(--destructive))'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-glass-border">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary">
            {payload[0].value} problem{payload[0].value !== 1 ? 's' : ''} solved
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBar = (props: any) => {
    const { fill, ...rest } = props;
    return (
      <Bar 
        {...rest} 
        fill={props.payload.color}
        radius={[4, 4, 0, 0]}
        className="hover:opacity-80 transition-opacity"
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card p-6 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Difficulty Breakdown
        </h3>
        <p className="text-sm text-muted-foreground">
          Problems solved by difficulty level
        </p>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <CustomBar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-glass-border">
        {chartData.map((item) => (
          <div key={item.name} className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {item.name}
              </span>
            </div>
            <span className="text-lg font-bold text-foreground">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};