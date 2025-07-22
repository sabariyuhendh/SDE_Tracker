// TUF SDE Sheet - 190 Problems Data Structure

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  url: string;
  completed: boolean;
  notes?: string;
  completedAt?: Date;
}

export interface Topic {
  name: string;
  icon: string;
  problems: Problem[];
}

export const sdeProblems: Topic[] = [
  {
    name: "Arrays",
    icon: "📊",
    problems: [
      {
        id: "arr-1",
        title: "Set Matrix Zeros",
        difficulty: "Medium",
        topic: "Arrays",
        url: "https://leetcode.com/problems/set-matrix-zeroes/",
        completed: false
      },
      {
        id: "arr-2",
        title: "Pascal's Triangle",
        difficulty: "Easy",
        topic: "Arrays",
        url: "https://leetcode.com/problems/pascals-triangle/",
        completed: false
      },
      {
        id: "arr-3",
        title: "Next Permutation",
        difficulty: "Medium",
        topic: "Arrays",
        url: "https://leetcode.com/problems/next-permutation/",
        completed: false
      },
      {
        id: "arr-4",
        title: "Kadane's Algorithm",
        difficulty: "Medium",
        topic: "Arrays",
        url: "https://leetcode.com/problems/maximum-subarray/",
        completed: false
      },
      {
        id: "arr-5",
        title: "Sort Colors",
        difficulty: "Medium",
        topic: "Arrays",
        url: "https://leetcode.com/problems/sort-colors/",
        completed: false
      },
      {
        id: "arr-6",
        title: "Stock Buy Sell",
        difficulty: "Easy",
        topic: "Arrays",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        completed: false
      }
    ]
  },
  {
    name: "Linked Lists",
    icon: "🔗",
    problems: [
      {
        id: "ll-1",
        title: "Reverse Linked List",
        difficulty: "Easy",
        topic: "Linked Lists",
        url: "https://leetcode.com/problems/reverse-linked-list/",
        completed: false
      },
      {
        id: "ll-2",
        title: "Middle of Linked List",
        difficulty: "Easy",
        topic: "Linked Lists",
        url: "https://leetcode.com/problems/middle-of-the-linked-list/",
        completed: false
      },
      {
        id: "ll-3",
        title: "Merge Two Lists",
        difficulty: "Easy",
        topic: "Linked Lists",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
        completed: false
      },
      {
        id: "ll-4",
        title: "Remove Nth From End",
        difficulty: "Medium",
        topic: "Linked Lists",
        url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        completed: false
      },
      {
        id: "ll-5",
        title: "Add Two Numbers",
        difficulty: "Medium",
        topic: "Linked Lists",
        url: "https://leetcode.com/problems/add-two-numbers/",
        completed: false
      }
    ]
  },
  {
    name: "Dynamic Programming",
    icon: "⚡",
    problems: [
      {
        id: "dp-1",
        title: "Climbing Stairs",
        difficulty: "Easy",
        topic: "Dynamic Programming",
        url: "https://leetcode.com/problems/climbing-stairs/",
        completed: false
      },
      {
        id: "dp-2",
        title: "Coin Change",
        difficulty: "Medium",
        topic: "Dynamic Programming",
        url: "https://leetcode.com/problems/coin-change/",
        completed: false
      },
      {
        id: "dp-3",
        title: "Longest Increasing Subsequence",
        difficulty: "Medium",
        topic: "Dynamic Programming",
        url: "https://leetcode.com/problems/longest-increasing-subsequence/",
        completed: false
      },
      {
        id: "dp-4",
        title: "Edit Distance",
        difficulty: "Hard",
        topic: "Dynamic Programming",
        url: "https://leetcode.com/problems/edit-distance/",
        completed: false
      },
      {
        id: "dp-5",
        title: "Maximum Product Subarray",
        difficulty: "Medium",
        topic: "Dynamic Programming",
        url: "https://leetcode.com/problems/maximum-product-subarray/",
        completed: false
      }
    ]
  },
  {
    name: "Trees",
    icon: "🌳",
    problems: [
      {
        id: "tree-1",
        title: "Inorder Traversal",
        difficulty: "Easy",
        topic: "Trees",
        url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
        completed: false
      },
      {
        id: "tree-2",
        title: "Maximum Depth",
        difficulty: "Easy",
        topic: "Trees",
        url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        completed: false
      },
      {
        id: "tree-3",
        title: "Symmetric Tree",
        difficulty: "Easy",
        topic: "Trees",
        url: "https://leetcode.com/problems/symmetric-tree/",
        completed: false
      },
      {
        id: "tree-4",
        title: "Path Sum",
        difficulty: "Easy",
        topic: "Trees",
        url: "https://leetcode.com/problems/path-sum/",
        completed: false
      },
      {
        id: "tree-5",
        title: "Validate BST",
        difficulty: "Medium",
        topic: "Trees",
        url: "https://leetcode.com/problems/validate-binary-search-tree/",
        completed: false
      }
    ]
  },
  {
    name: "Graphs",
    icon: "🕸️",
    problems: [
      {
        id: "graph-1",
        title: "Clone Graph",
        difficulty: "Medium",
        topic: "Graphs",
        url: "https://leetcode.com/problems/clone-graph/",
        completed: false
      },
      {
        id: "graph-2",
        title: "Course Schedule",
        difficulty: "Medium",
        topic: "Graphs",
        url: "https://leetcode.com/problems/course-schedule/",
        completed: false
      },
      {
        id: "graph-3",
        title: "Number of Islands",
        difficulty: "Medium",
        topic: "Graphs",
        url: "https://leetcode.com/problems/number-of-islands/",
        completed: false
      },
      {
        id: "graph-4",
        title: "Word Ladder",
        difficulty: "Hard",
        topic: "Graphs",
        url: "https://leetcode.com/problems/word-ladder/",
        completed: false
      }
    ]
  },
  {
    name: "Strings",
    icon: "📝",
    problems: [
      {
        id: "str-1",
        title: "Longest Substring",
        difficulty: "Medium",
        topic: "Strings",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        completed: false
      },
      {
        id: "str-2",
        title: "Valid Anagram",
        difficulty: "Easy",
        topic: "Strings",
        url: "https://leetcode.com/problems/valid-anagram/",
        completed: false
      },
      {
        id: "str-3",
        title: "Group Anagrams",
        difficulty: "Medium",
        topic: "Strings",
        url: "https://leetcode.com/problems/group-anagrams/",
        completed: false
      },
      {
        id: "str-4",
        title: "Valid Parentheses",
        difficulty: "Easy",
        topic: "Strings",
        url: "https://leetcode.com/problems/valid-parentheses/",
        completed: false
      }
    ]
  }
];

// Calculate total problems
export const TOTAL_PROBLEMS = sdeProblems.reduce((total, topic) => total + topic.problems.length, 0);

// Difficulty colors
export const difficultyColors = {
  Easy: "success",
  Medium: "warning", 
  Hard: "destructive"
} as const;

// Weekly progress interface
export interface WeeklyReflection {
  weekStartDate: string;
  problemsSolved: number;
  topicBreakdown: Record<string, number>;
  difficultyBreakdown: Record<string, number>;
  whatWentWell: string;
  struggledWith: string;
  focusForNextWeek: string;
  averageTimePerProblem?: number;
}