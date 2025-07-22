import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ProgressCardProps {
  title: string;
  value: number;
  total?: number;
  percentage?: number;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const ProgressCard = ({ 
  title, 
  value, 
  total, 
  percentage, 
  icon, 
  trend = 'neutral',
  className = '' 
}: ProgressCardProps) => {
  const displayPercentage = percentage ?? (total ? Math.round((value / total) * 100) : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-6 hover-lift ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        
        {trend !== 'neutral' && (
          <Badge variant={trend === 'up' ? 'default' : 'secondary'} className="text-xs">
            {trend === 'up' ? '↗' : '↘'}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold gradient-text-primary">{value}</span>
          {total && <span className="text-muted-foreground">/ {total}</span>}
        </div>

        {total && (
          <div className="space-y-2">
            <Progress 
              value={displayPercentage} 
              className="h-2 bg-secondary"
            />
            <p className="text-sm text-muted-foreground">
              {displayPercentage}% completed
            </p>
          </div>
        )}

        {!total && percentage !== undefined && (
          <div className="space-y-2">
            <Progress 
              value={percentage} 
              className="h-2 bg-secondary"
            />
            <p className="text-sm text-muted-foreground">
              {percentage}% this week
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};