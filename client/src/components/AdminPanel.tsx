import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, 
  UserPlus, 
  Upload, 
  RotateCcw, 
  Users,
  Plus,
  Check,
  X,
  ArrowLeft
} from "lucide-react";
import { useStudents } from "@/hooks/useHardcodedData";
import { useLocation } from "wouter";

export default function AdminPanel() {
  const { toast } = useToast();
  const { students, isLoading, addStudent, resetStudent } = useStudents();
  const [, setLocation] = useLocation();
  
  // States for forms
  const [newStudent, setNewStudent] = useState({ 
    username: "", 
    name: "", 
    avatar: ""
  });
  const [bulkStudents, setBulkStudents] = useState("");
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isResetting, setIsResetting] = useState<number | null>(null);

  const topics = students[0] ? Object.keys(students[0].topicProgress || {}) : [];

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.username || !newStudent.name) return;
    
    setIsCreating(true);
    try {
      const studentData = {
        userId: "Volcaryx",
        username: newStudent.username,
        name: newStudent.name,
        avatar: newStudent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStudent.username}`,
        totalSolved: 0,
        weeklyProgress: {},
        topicProgress: {
          "Arrays": { solved: 0, total: 30, percentage: 0 },
          "Strings": { solved: 0, total: 25, percentage: 0 },
          "Linked List": { solved: 0, total: 22, percentage: 0 },
          "Binary Trees": { solved: 0, total: 20, percentage: 0 },
          "Dynamic Programming": { solved: 0, total: 18, percentage: 0 },
          "Graph": { solved: 0, total: 15, percentage: 0 },
          "Stack & Queue": { solved: 0, total: 25, percentage: 0 },
          "Heap": { solved: 0, total: 12, percentage: 0 },
          "Trie": { solved: 0, total: 8, percentage: 0 },
          "Sliding Window": { solved: 0, total: 15, percentage: 0 }
        },
        difficultyStats: { easy: 0, medium: 0, hard: 0 },
        reflection: null
      };
      
      await addStudent(studentData);
      setNewStudent({ username: "", name: "", avatar: "" });
      toast({ title: "Student created successfully!" });
    } catch (error) {
      toast({ title: "Failed to create student", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const studentsArray = JSON.parse(bulkStudents);
      if (!Array.isArray(studentsArray)) {
        toast({ title: "Invalid format - must be an array", variant: "destructive" });
        return;
      }
      
      for (const studentData of studentsArray) {
        const fullStudentData = {
          userId: "Volcaryx",
          username: studentData.username,
          name: studentData.name || studentData.username,
          avatar: studentData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.username}`,
          totalSolved: 0,
          weeklyProgress: {},
          topicProgress: {
            "Arrays": { solved: 0, total: 30, percentage: 0 },
            "Strings": { solved: 0, total: 25, percentage: 0 },
            "Linked List": { solved: 0, total: 22, percentage: 0 },
            "Binary Trees": { solved: 0, total: 20, percentage: 0 },
            "Dynamic Programming": { solved: 0, total: 18, percentage: 0 },
            "Graph": { solved: 0, total: 15, percentage: 0 },
            "Stack & Queue": { solved: 0, total: 25, percentage: 0 },
            "Heap": { solved: 0, total: 12, percentage: 0 },
            "Trie": { solved: 0, total: 8, percentage: 0 },
            "Sliding Window": { solved: 0, total: 15, percentage: 0 }
          },
          difficultyStats: { easy: 0, medium: 0, hard: 0 },
          reflection: null
        };
        await addStudent(fullStudentData);
      }
      
      setBulkStudents("");
      setShowBulkForm(false);
      toast({ title: `${studentsArray.length} students created successfully!` });
    } catch (error) {
      toast({ title: "Invalid JSON format", variant: "destructive" });
    }
  };

  const handleResetStudent = async (studentId: number) => {
    setIsResetting(studentId);
    try {
      await resetStudent(studentId);
      toast({ title: "Student progress reset successfully!" });
    } catch (error) {
      toast({ title: "Failed to reset progress", variant: "destructive" });
    } finally {
      setIsResetting(null);
    }
  };

  const parseCSVStudents = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const studentsArray = lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      return {
        username: parts[0] || '',
        name: parts[1] || parts[0] || '',
        avatar: parts[2] || ''
      };
    }).filter(s => s.username);
    
    setBulkStudents(JSON.stringify(studentsArray, null, 2));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-[#F4F4F4]">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          </div>

      {/* Add Single Student */}
      <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add Single Student
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username" className="text-[#E6E6FA]">Username</Label>
                <Input
                  id="username"
                  value={newStudent.username}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="student_username"
                  className="bg-white/10 border-white/20 text-[#F4F4F4] placeholder:text-[#E6E6FA]/60"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name" className="text-[#E6E6FA]">Full Name</Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  className="bg-white/10 border-white/20 text-[#F4F4F4] placeholder:text-[#E6E6FA]/60"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="avatar" className="text-[#E6E6FA]">Avatar URL (Optional)</Label>
              <Input
                id="avatar"
                value={newStudent.avatar}
                onChange={(e) => setNewStudent(prev => ({ ...prev, avatar: e.target.value }))}
                placeholder="https://..."
                className="bg-white/10 border-white/20 text-[#F4F4F4] placeholder:text-[#E6E6FA]/60"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-white text-[#516395] hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? "Creating..." : "Create Student"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Bulk Upload Students */}
      <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Upload Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showBulkForm ? (
            <div className="space-y-4">
              <p className="text-[#E6E6FA] text-sm">
                Upload multiple students at once using CSV or JSON format
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowBulkForm(true)}
                  variant="outline"
                  className="border-white/20 text-[#F4F4F4] hover:bg-white/10"
                >
                  Upload JSON
                </Button>
                <Button
                  onClick={() => {
                    parseCSVStudents("student1,John Doe,https://example.com/avatar1.jpg\nstudent2,Jane Smith");
                    setShowBulkForm(true);
                  }}
                  variant="outline"
                  className="border-white/20 text-[#F4F4F4] hover:bg-white/10"
                >
                  CSV Example
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBulkUpload} className="space-y-4">
              <div>
                <Label className="text-[#E6E6FA]">Student Data (JSON Array)</Label>
                <Textarea
                  value={bulkStudents}
                  onChange={(e) => setBulkStudents(e.target.value)}
                  placeholder='[{"username": "student1", "name": "John Doe", "avatar": "https://..."}, ...]'
                  rows={8}
                  className="bg-white/10 border-white/20 text-[#F4F4F4] placeholder:text-[#E6E6FA]/60"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-white text-[#516395] hover:bg-gray-100">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Students
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setShowBulkForm(false)}
                  variant="outline"
                  className="border-white/20 text-[#F4F4F4] hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Current Students */}
      <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Current Students ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={student.avatar || undefined} />
                    <AvatarFallback className="bg-white/20 text-[#F4F4F4]">
                      {student.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-[#F4F4F4]">{student.name}</h4>
                    <p className="text-sm text-[#E6E6FA]">@{student.username}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-[#F4F4F4]">
                    {student.totalSolved || 0} solved
                  </Badge>
                </div>
                <Button
                  onClick={() => handleResetStudent(student.id)}
                  disabled={isResetting === student.id}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-[#F4F4F4] hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {isResetting === student.id ? "Resetting..." : "Reset"}
                </Button>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-center text-[#E6E6FA] py-8">
                No students found. Add some students to get started!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}