// TUF Class Tracker - Student Management & Individual Progress

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Edit3, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useClassProgress } from '@/hooks/useClassProgress';
import { TOPICS, Topic, DIFFICULTY_COLORS } from '@/data/classData';
import { useToast } from '@/hooks/use-toast';

export const StudentManager = () => {
  const { 
    students, 
    selectedStudent, 
    setSelectedStudent, 
    addStudent, 
    updateTopicProgress,
    updateStudentProgress,
    removeStudent,
    getCurrentStudent 
  } = useClassProgress();
  
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudentData, setNewStudentData] = useState({ username: '', name: '' });
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<{ [key: string]: number }>({});

  const currentStudent = getCurrentStudent();

  const handleAddStudent = () => {
    if (!newStudentData.username || !newStudentData.name) {
      toast({
        title: "Missing Information",
        description: "Please provide both username and name",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate username
    if (students.some(s => s.username === newStudentData.username)) {
      toast({
        title: "Username Exists",
        description: "This username is already taken",
        variant: "destructive"
      });
      return;
    }

    addStudent(newStudentData.username, newStudentData.name);
    setNewStudentData({ username: '', name: '' });
    setShowAddForm(false);
    
    toast({
      title: "Student Added",
      description: `${newStudentData.name} has been added to the class`,
    });
  };

  const handleTopicUpdate = (topic: Topic, solved: number) => {
    if (!currentStudent) return;
    
    const topicData = currentStudent.topicProgress[topic];
    const total = topicData?.total || 0;
    
    updateTopicProgress(currentStudent.id, topic, solved, total);
    setEditingTopic(null);
    setTempValues({});
    
    toast({
      title: "Progress Updated",
      description: `${topic} progress updated for ${currentStudent.name}`,
    });
  };

  const handleReflectionUpdate = (reflection: string) => {
    if (!currentStudent) return;
    
    updateStudentProgress(currentStudent.id, { reflection });
    
    toast({
      title: "Reflection Saved",
      description: "Student reflection has been updated",
    });
  };

  const getDifficultyBreakdown = () => {
    if (!currentStudent) return null;
    
    const { easy, medium, hard } = currentStudent.difficultyStats;
    const total = easy + medium + hard;
    
    return total > 0 ? [
      { label: 'Easy', count: easy, percentage: (easy / total) * 100, color: DIFFICULTY_COLORS.easy },
      { label: 'Medium', count: medium, percentage: (medium / total) * 100, color: DIFFICULTY_COLORS.medium },
      { label: 'Hard', count: hard, percentage: (hard / total) * 100, color: DIFFICULTY_COLORS.hard }
    ] : [];
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
      {/* Student Selection & Add New */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Student Manager</span>
                <Badge variant="outline">{students.length} students</Badge>
              </div>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-card/50 border border-primary/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">TUF Username</Label>
                      <Input
                        id="username"
                        value={newStudentData.username}
                        onChange={(e) => setNewStudentData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="e.g. john_doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newStudentData.name}
                        onChange={(e) => setNewStudentData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. John Doe"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddForm(false)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddStudent}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Add Student
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Student Selection */}
            {students.length > 0 && (
              <div className="space-y-4">
                <Label>Select Student to Manage</Label>
                <Select value={selectedStudent || ''} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        <div className="flex items-center space-x-2">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span>{student.name}</span>
                          <span className="text-muted-foreground">@{student.username}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Individual Student Dashboard */}
      {currentStudent && (
        <>
          {/* Student Overview */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={currentStudent.avatar}
                      alt={currentStudent.name}
                      className="w-16 h-16 rounded-full border-2 border-primary/20"
                    />
                    <div>
                      <CardTitle className="text-2xl">{currentStudent.name}</CardTitle>
                      <p className="text-muted-foreground">@{currentStudent.username}</p>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {new Date(currentStudent.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {currentStudent.totalSolved}
                      <span className="text-lg text-muted-foreground">/190</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((currentStudent.totalSolved / 190) * 100)}% Complete
                    </div>
                    <Progress 
                      value={(currentStudent.totalSolved / 190) * 100} 
                      className="w-32 h-2 mt-2"
                    />
                  </div>
                </div>
              </CardHeader>
              
              {/* Difficulty Breakdown */}
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-medium">Difficulty Breakdown</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {getDifficultyBreakdown()?.map(diff => (
                      <div key={diff.label} className="text-center p-3 rounded-lg bg-card/50">
                        <div className="text-2xl font-bold" style={{ color: diff.color }}>
                          {diff.count}
                        </div>
                        <div className="text-sm text-muted-foreground">{diff.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(diff.percentage)}%
                        </div>
                      </div>
                    )) || (
                      <div className="col-span-3 text-center text-muted-foreground">
                        No difficulty data available
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Topic Progress Management */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit3 className="w-5 h-5 text-accent" />
                  <span>Topic Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TOPICS.map(topic => {
                    const progress = currentStudent.topicProgress[topic];
                    const isEditing = editingTopic === topic;
                    
                    return (
                      <motion.div
                        key={topic}
                        className="p-4 rounded-xl bg-card/50 space-y-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">{topic}</h5>
                          {!isEditing ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingTopic(topic);
                                setTempValues({ [topic]: progress?.solved || 0 });
                              }}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          ) : (
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTopicUpdate(topic, tempValues[topic] || 0)}
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingTopic(null);
                                  setTempValues({});
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {isEditing ? (
                          <div className="space-y-2">
                            <Label>Problems Solved</Label>
                            <Input
                              type="number"
                              min="0"
                              max={progress?.total || 0}
                              value={tempValues[topic] || 0}
                              onChange={(e) => setTempValues(prev => ({
                                ...prev,
                                [topic]: parseInt(e.target.value) || 0
                              }))}
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{progress?.solved || 0} solved</span>
                              <span>{progress?.percentage || 0}%</span>
                            </div>
                            <Progress value={progress?.percentage || 0} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              out of {progress?.total || 0} problems
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Student Reflection */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Personal Reflection</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add personal notes, goals, or reflections for this student..."
                  value={currentStudent.reflection || ''}
                  onChange={(e) => handleReflectionUpdate(e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {students.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-12"
        >
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Students Yet</h3>
          <p className="text-muted-foreground">Add your first student to start tracking progress</p>
        </motion.div>
      )}
    </motion.div>
  );
};