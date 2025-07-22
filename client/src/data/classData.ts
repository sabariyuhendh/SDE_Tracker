// TUF Class Tracker - Student and Class Data Management

export interface Student {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  totalSolved: number;
  weeklyProgress: {
    [week: string]: number; // week key -> problems solved
  };
  topicProgress: {
    [topic: string]: {
      solved: number;
      total: number;
      percentage: number;
    };
  };
  difficultyStats: {
    easy: number;
    medium: number;
    hard: number;
  };
  reflection?: string;
  lastUpdated: string;
}

export interface WeeklyReflection {
  weekStart: string;
  classStats: {
    totalSolved: number;
    averageSolved: number;
    topPerformer: string;
    mostImproved: string;
  };
  topicBreakdown: {
    [topic: string]: {
      studentsCompleted: number;
      averageProgress: number;
    };
  };
  highlights: string[];
  notes: string;
}

export const TOPICS = [
  "Array",
  "Matrix", 
  "String",
  "Searching & Sorting",
  "Linked List",
  "Binary Trees",
  "Binary Search Trees",
  "Greedy",
  "Backtracking",
  "Stacks and Queues",
  "Heap",
  "Graph",
  "Trie",
  "Dynamic Programming"
] as const;

export type Topic = typeof TOPICS[number];

export const DIFFICULTY_COLORS = {
  easy: "hsl(142 71% 45%)",
  medium: "hsl(38 92% 50%)", 
  hard: "hsl(0 84% 60%)"
} as const;

// Default student template
export const createNewStudent = (username: string, name: string): Student => ({
  id: crypto.randomUUID(),
  username,
  name,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
  totalSolved: 0,
  weeklyProgress: {},
  topicProgress: TOPICS.reduce((acc, topic) => ({
    ...acc,
    [topic]: { solved: 0, total: getTopicTotal(topic), percentage: 0 }
  }), {}),
  difficultyStats: { easy: 0, medium: 0, hard: 0 },
  lastUpdated: new Date().toISOString()
});

// Helper to get total problems per topic (based on SDE sheet distribution)
function getTopicTotal(topic: Topic): number {
  const topicTotals: Record<Topic, number> = {
    "Array": 25,
    "Matrix": 6,
    "String": 15,
    "Searching & Sorting": 18,
    "Linked List": 14,
    "Binary Trees": 25,
    "Binary Search Trees": 10,
    "Greedy": 12,
    "Backtracking": 9,
    "Stacks and Queues": 12,
    "Heap": 6,
    "Graph": 15,
    "Trie": 6,
    "Dynamic Programming": 17
  };
  return topicTotals[topic] || 0;
}

// Get current week key for tracking
export const getCurrentWeek = (): string => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Start of this week (Sunday)
  return startOfWeek.toISOString().split('T')[0];
};

// Calculate class leaderboard
export const getClassLeaderboard = (students: Student[]) => {
  return students
    .map(student => ({
      ...student,
      percentage: (student.totalSolved / 190) * 100
    }))
    .sort((a, b) => b.totalSolved - a.totalSolved);
};

// Get most improved student this week
export const getMostImproved = (students: Student[]): Student | null => {
  const currentWeek = getCurrentWeek();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekKey = lastWeek.toISOString().split('T')[0];

  let maxImprovement = 0;
  let mostImproved: Student | null = null;

  students.forEach(student => {
    const thisWeek = student.weeklyProgress[currentWeek] || 0;
    const previousWeek = student.weeklyProgress[lastWeekKey] || 0;
    const improvement = thisWeek - previousWeek;

    if (improvement > maxImprovement) {
      maxImprovement = improvement;
      mostImproved = student;
    }
  });

  return mostImproved;
};