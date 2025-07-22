import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapData {
  date: string;
  count: number;
  level: number; // 0-4 intensity levels
}

interface HeatmapCalendarProps {
  data: HeatmapData[];
  className?: string;
}

export const HeatmapCalendar = ({ data, className = '' }: HeatmapCalendarProps) => {
  const getIntensityClass = (level: number) => {
    const baseClasses = "w-8 h-8 rounded-lg border border-glass-border transition-all duration-200 hover:scale-110";
    
    switch (level) {
      case 0:
        return `${baseClasses} bg-secondary`;
      case 1:
        return `${baseClasses} bg-primary/20`;
      case 2:
        return `${baseClasses} bg-primary/40`;
      case 3:
        return `${baseClasses} bg-primary/60`;
      case 4:
        return `${baseClasses} bg-primary glow-primary`;
      default:
        return `${baseClasses} bg-secondary`;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card p-6 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Weekly Activity
        </h3>
        <p className="text-sm text-muted-foreground">
          Problems solved in the last 7 days
        </p>
      </div>

      <TooltipProvider>
        <div className="space-y-3">
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getIntensityClass(level).split(' ').slice(-1)[0]}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {data.map((day, index) => (
              <Tooltip key={day.date}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={getIntensityClass(day.level)}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <span className="text-xs font-medium text-foreground/80">
                        {getDayLabel(day.date).charAt(0)}
                      </span>
                      {day.count > 0 && (
                        <span className="text-xs font-bold text-foreground">
                          {day.count}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-glass-border">
                  <div className="text-center">
                    <p className="font-medium">{formatDate(day.date)}</p>
                    <p className="text-sm text-muted-foreground">
                      {day.count} problem{day.count !== 1 ? 's' : ''} solved
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>
    </motion.div>
  );
};