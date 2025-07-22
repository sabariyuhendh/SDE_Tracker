// TUF Class Tracker - Weekend Review for Class Analytics

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Users, Download, Award, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useClassProgress } from '@/hooks/useClassProgress';
import { getClassLeaderboard, getMostImproved, getCurrentWeek, TOPICS } from '@/data/classData';
import { useToast } from '@/hooks/use-toast';

export const ClassWeekendReview = () => {
  const { 
    students, 
    getClassStats, 
    getWeeklyStats, 
    saveWeeklyReflection,
    weeklyReflections 
  } = useClassProgress();
  
  const { toast } = useToast();
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [highlights, setHighlights] = useState(['']);

  const classStats = getClassStats();
  const weeklyStats = getWeeklyStats();
  const leaderboard = getClassLeaderboard(students);
  const mostImproved = getMostImproved(students);
  const currentWeek = getCurrentWeek();

  // Calculate topic completion breakdown
  const getTopicBreakdown = () => {
    return TOPICS.map(topic => {
      const studentsWithProgress = students.filter(s => 
        s.topicProgress[topic] && s.topicProgress[topic].solved > 0
      );
      
      const totalProgress = students.reduce((sum, s) => 
        sum + (s.topicProgress[topic]?.percentage || 0), 0
      );
      
      return {
        topic,
        studentsCompleted: studentsWithProgress.length,
        averageProgress: students.length > 0 ? Math.round(totalProgress / students.length) : 0,
        completionRate: students.length > 0 ? (studentsWithProgress.length / students.length) * 100 : 0
      };
    });
  };

  const topicBreakdown = getTopicBreakdown();

  const handleSaveReflection = () => {
    const reflection = {
      classStats: {
        totalSolved: weeklyStats.totalThisWeek,
        averageSolved: weeklyStats.averageThisWeek,
        topPerformer: leaderboard[0]?.name || '',
        mostImproved: mostImproved?.name || ''
      },
      topicBreakdown: topicBreakdown.reduce((acc, item) => ({
        ...acc,
        [item.topic]: {
          studentsCompleted: item.studentsCompleted,
          averageProgress: item.averageProgress
        }
      }), {}),
      highlights: highlights.filter(h => h.trim() !== ''),
      notes: reflectionNotes
    };

    saveWeeklyReflection(reflection);
    
    toast({
      title: "Weekly Review Saved",
      description: "Class review has been saved successfully",
    });
  };

  const addHighlight = () => {
    setHighlights([...highlights, '']);
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const exportSummary = () => {
    // Create a simple text summary for export
    const summary = `
TUF Class Tracker - Weekly Review
Week of: ${new Date(currentWeek).toLocaleDateString()}
Generated: ${new Date().toLocaleDateString()}

CLASS OVERVIEW:
- Total Students: ${classStats.totalStudents}
- Problems Solved This Week: ${weeklyStats.totalThisWeek}
- Average per Student: ${weeklyStats.averageThisWeek}
- Overall Completion: ${classStats.completionRate}%

TOP PERFORMERS:
${leaderboard.slice(0, 5).map((s, i) => 
  `${i + 1}. ${s.name} (@${s.username}) - ${s.totalSolved} problems (${Math.round((s.totalSolved / 190) * 100)}%)`
).join('\n')}

MOST IMPROVED: ${mostImproved?.name || 'N/A'}

TOPIC PROGRESS:
${topicBreakdown.map(t => 
  `${t.topic}: ${t.studentsCompleted}/${classStats.totalStudents} students (${t.averageProgress}% avg)`
).join('\n')}

NOTES:
${reflectionNotes}

HIGHLIGHTS:
${highlights.filter(h => h.trim()).map(h => `- ${h}`).join('\n')}
    `.trim();

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TUF-Class-Review-${currentWeek}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Summary Exported",
      description: "Weekly summary has been downloaded",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Weekend Review Header */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-primary/20">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Weekend Review</CardTitle>
                  <p className="text-muted-foreground">
                    Week of {new Date(currentWeek).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {students.length} Students
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Weekly Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{weeklyStats.totalThisWeek}</p>
                  <p className="text-sm text-muted-foreground">Problems This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{weeklyStats.averageThisWeek}</p>
                  <p className="text-sm text-muted-foreground">Average per Student</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Award className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-lg font-bold truncate">
                    {leaderboard[0]?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">Top Performer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Target className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-lg font-bold truncate">
                    {mostImproved?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">Most Improved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Topic Progress Overview */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Topic Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topicBreakdown.map(topic => (
                <div key={topic.topic} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{topic.topic}</span>
                    <Badge variant="outline">
                      {topic.studentsCompleted}/{classStats.totalStudents}
                    </Badge>
                  </div>
                  <Progress value={topic.completionRate} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    {topic.averageProgress}% average progress
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Highlights */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Weekly Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => updateHighlight(index, e.target.value)}
                  placeholder="Add a highlight from this week..."
                  className="flex-1 px-3 py-2 rounded-lg bg-card/50 border border-border"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeHighlight(index)}
                  disabled={highlights.length === 1}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addHighlight}
              className="w-full"
            >
              + Add Highlight
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reflection Notes */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Weekly Reflection</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={reflectionNotes}
              onChange={(e) => setReflectionNotes(e.target.value)}
              placeholder="Reflect on the week: What went well? What challenges did the class face? Goals for next week?"
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={exportSummary}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Summary</span>
          </Button>
          <Button
            onClick={handleSaveReflection}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Save Review</span>
          </Button>
        </div>
      </motion.div>

      {/* Previous Reviews */}
      {weeklyReflections.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Previous Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weeklyReflections.slice(0, 3).map(review => (
                  <div
                    key={review.weekStart}
                    className="flex justify-between items-center p-3 rounded-lg bg-card/50"
                  >
                    <div>
                      <p className="font-medium">
                        Week of {new Date(review.weekStart).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {review.classStats.totalSolved} problems solved
                      </p>
                    </div>
                    <Badge variant="outline">
                      {review.highlights.length} highlights
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};