import { useState, useEffect, useCallback } from 'react';
import { Problem, Topic, sdeProblems, TOTAL_PROBLEMS, WeeklyReflection } from '@/data/sdeProblems';

const STORAGE_KEY = 'tuf-tracker-progress';
const REFLECTION_KEY = 'tuf-tracker-reflections';

interface ProgressStats {
  totalCompleted: number;
  totalProblems: number;
  completionPercentage: number;
  topicStats: Record<string, { completed: number; total: number; percentage: number }>;
  difficultyStats: Record<string, number>;
  weeklyCount: number;
  streak: number;
  recentProblems: Problem[];
}

export const useSDEProgress = () => {
  const [problems, setProblems] = useState<Topic[]>(sdeProblems);
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    const savedReflections = localStorage.getItem(REFLECTION_KEY);
    
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        setProblems(parsedProgress);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }

    if (savedReflections) {
      try {
        const parsedReflections = JSON.parse(savedReflections);
        setReflections(parsedReflections);
      } catch (error) {
        console.error('Error loading reflections:', error);
      }
    }
  }, []);

  // Save to localStorage whenever problems change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
  }, [problems]);

  // Save reflections to localStorage
  useEffect(() => {
    localStorage.setItem(REFLECTION_KEY, JSON.stringify(reflections));
  }, [reflections]);

  // Toggle problem completion
  const toggleProblem = useCallback((problemId: string) => {
    setProblems(prev => prev.map(topic => ({
      ...topic,
      problems: topic.problems.map(problem => 
        problem.id === problemId 
          ? { 
              ...problem, 
              completed: !problem.completed,
              completedAt: !problem.completed ? new Date() : undefined
            }
          : problem
      )
    })));
  }, []);

  // Update problem notes
  const updateProblemNotes = useCallback((problemId: string, notes: string) => {
    setProblems(prev => prev.map(topic => ({
      ...topic,
      problems: topic.problems.map(problem => 
        problem.id === problemId 
          ? { ...problem, notes }
          : problem
      )
    })));
  }, []);

  // Calculate progress statistics
  const getProgressStats = useCallback((): ProgressStats => {
    const flatProblems = problems.flatMap(topic => topic.problems);
    const completedProblems = flatProblems.filter(p => p.completed);
    
    // Topic-wise stats
    const topicStats: Record<string, { completed: number; total: number; percentage: number }> = {};
    problems.forEach(topic => {
      const completed = topic.problems.filter(p => p.completed).length;
      const total = topic.problems.length;
      topicStats[topic.name] = {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });

    // Difficulty-wise stats
    const difficultyStats: Record<string, number> = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };
    completedProblems.forEach(problem => {
      difficultyStats[problem.difficulty]++;
    });

    // Weekly count (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyCount = completedProblems.filter(p => 
      p.completedAt && new Date(p.completedAt) > weekAgo
    ).length;

    // Recent problems (last 5)
    const recentProblems = completedProblems
      .filter(p => p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 5);

    return {
      totalCompleted: completedProblems.length,
      totalProblems: TOTAL_PROBLEMS,
      completionPercentage: Math.round((completedProblems.length / TOTAL_PROBLEMS) * 100),
      topicStats,
      difficultyStats,
      weeklyCount,
      streak: calculateStreak(completedProblems),
      recentProblems
    };
  }, [problems]);

  // Calculate current streak
  const calculateStreak = (completedProblems: Problem[]): number => {
    if (completedProblems.length === 0) return 0;

    const dates = completedProblems
      .filter(p => p.completedAt)
      .map(p => new Date(p.completedAt!).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if we solved something today or yesterday
    if (dates.length > 0 && (dates[0] === today || dates[0] === yesterday.toDateString())) {
      streak = 1;
      
      // Count consecutive days
      for (let i = 1; i < dates.length; i++) {
        const currentDate = new Date(dates[i]);
        const previousDate = new Date(dates[i - 1]);
        const dayDiff = Math.floor((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    return streak;
  };

  // Get problems for current week for heatmap
  const getWeeklyHeatmapData = useCallback(() => {
    const now = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const completedCount = problems
        .flatMap(topic => topic.problems)
        .filter(p => p.completed && p.completedAt && new Date(p.completedAt).toDateString() === dateStr)
        .length;
      
      data.push({
        date: dateStr,
        count: completedCount,
        level: Math.min(Math.floor(completedCount / 2), 4) // 0-4 intensity levels
      });
    }
    
    return data;
  }, [problems]);

  // Save weekly reflection
  const saveWeeklyReflection = useCallback((reflection: Omit<WeeklyReflection, 'weekStartDate'>) => {
    const weekStart = getWeekStartDate().toISOString();
    const newReflection: WeeklyReflection = {
      ...reflection,
      weekStartDate: weekStart
    };
    
    setReflections(prev => {
      const filtered = prev.filter(r => r.weekStartDate !== weekStart);
      return [...filtered, newReflection];
    });
  }, []);

  // Get week start date (Monday)
  const getWeekStartDate = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // Check if it's weekend
  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  return {
    problems,
    reflections,
    toggleProblem,
    updateProblemNotes,
    getProgressStats,
    getWeeklyHeatmapData,
    saveWeeklyReflection,
    isWeekend: isWeekend(),
    stats: getProgressStats()
  };
};