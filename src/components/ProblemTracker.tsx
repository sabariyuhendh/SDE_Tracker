import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronRight, StickyNote } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Problem, Topic, difficultyColors } from '@/data/sdeProblems';

interface ProblemTrackerProps {
  topics: Topic[];
  onToggleProblem: (problemId: string) => void;
  onUpdateNotes: (problemId: string, notes: string) => void;
  className?: string;
}

export const ProblemTracker = ({ 
  topics, 
  onToggleProblem, 
  onUpdateNotes, 
  className = '' 
}: ProblemTrackerProps) => {
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set());
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const toggleTopic = (topicName: string) => {
    const newOpenTopics = new Set(openTopics);
    if (newOpenTopics.has(topicName)) {
      newOpenTopics.delete(topicName);
    } else {
      newOpenTopics.add(topicName);
    }
    setOpenTopics(newOpenTopics);
  };

  const toggleNotes = (problemId: string) => {
    const newExpandedNotes = new Set(expandedNotes);
    if (newExpandedNotes.has(problemId)) {
      newExpandedNotes.delete(problemId);
    } else {
      newExpandedNotes.add(problemId);
    }
    setExpandedNotes(newExpandedNotes);
  };

  const getDifficultyVariant = (difficulty: Problem['difficulty']) => {
    return difficultyColors[difficulty] as "default" | "secondary" | "destructive" | "outline";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-4 ${className}`}
    >
      {topics.map((topic, topicIndex) => {
        const completedCount = topic.problems.filter(p => p.completed).length;
        const isOpen = openTopics.has(topic.name);

        return (
          <motion.div
            key={topic.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: topicIndex * 0.1 }}
            className="glass-card overflow-hidden"
          >
            <Collapsible open={isOpen} onOpenChange={() => toggleTopic(topic.name)}>
              <CollapsibleTrigger asChild>
                <div className="w-full p-6 flex items-center justify-between cursor-pointer hover:bg-glass/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{topic.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {completedCount} / {topic.problems.length} completed
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="px-3 py-1">
                      {Math.round((completedCount / topic.problems.length) * 100)}%
                    </Badge>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </div>
                </div>
              </CollapsibleTrigger>

              <AnimatePresence>
                {isOpen && (
                  <CollapsibleContent asChild>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-glass-border"
                    >
                      <div className="p-6 pt-4 space-y-3">
                        {topic.problems.map((problem, problemIndex) => (
                          <motion.div
                            key={problem.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: problemIndex * 0.05 }}
                            className={`p-4 rounded-xl border transition-all duration-200 ${
                              problem.completed 
                                ? 'bg-success/10 border-success/30' 
                                : 'bg-secondary/30 border-glass-border hover:border-primary/30'
                            }`}
                          >
                            <div className="flex items-start space-x-4">
                              <Checkbox
                                checked={problem.completed}
                                onCheckedChange={() => onToggleProblem(problem.id)}
                                className="mt-1"
                              />
                              
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <h4 className={`font-medium ${
                                      problem.completed 
                                        ? 'text-success line-through' 
                                        : 'text-foreground'
                                    }`}>
                                      {problem.title}
                                    </h4>
                                    <Badge 
                                      variant={getDifficultyVariant(problem.difficulty)}
                                      className="text-xs"
                                    >
                                      {problem.difficulty}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleNotes(problem.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <StickyNote className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      asChild
                                      className="h-8 w-8 p-0"
                                    >
                                      <a 
                                        href={problem.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </a>
                                    </Button>
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {expandedNotes.has(problem.id) && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <Textarea
                                        placeholder="Add your notes, approach, or learnings..."
                                        value={problem.notes || ''}
                                        onChange={(e) => onUpdateNotes(problem.id, e.target.value)}
                                        className="mt-2 min-h-[80px] bg-background/50 border-glass-border"
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </CollapsibleContent>
                )}
              </AnimatePresence>
            </Collapsible>
          </motion.div>
        );
      })}
    </motion.div>
  );
};