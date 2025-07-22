import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, 
  UserPlus, 
  Upload, 
  Target, 
  RotateCcw, 
  Users,
  Plus,
  Check,
  X
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Student {
  id: number;
  username: string;
  name: string;
  avatar?: string;
  totalSolved: number;
  topicProgress: Record<string, { solved: number; total: number; percentage: number }>;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // States for forms
  const [newStudent, setNewStudent] = useState({ username: "", name: "", avatar: "" });
  const [bulkStudents, setBulkStudents] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [problemCount, setProblemCount] = useState(1);
  const [showBulkForm, setShowBulkForm] = useState(false);

  const { data: studentsData } = useQuery<{ students: Student[] }>({
    queryKey: ["/api/students"],
  });

  const students = studentsData?.students || [];
  const topics = students[0] ? Object.keys(students[0].topicProgress) : [];

  // Mutations
  const createStudentMutation = useMutation({
    mutationFn: (data: typeof newStudent) => apiRequest("/api/students", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      setNewStudent({ username: "", name: "", avatar: "" });
      toast({ title: "Student created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create student", variant: "destructive" });
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: (students: any[]) => apiRequest("/api/admin/students/bulk", { method: "POST", body: JSON.stringify({ students }) }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      setBulkStudents("");
      setShowBulkForm(false);
      toast({ title: `${data.count} students created successfully!` });
    },
    onError: () => {
      toast({ title: "Failed to bulk create students", variant: "destructive" });
    },
  });

  const markSolvedMutation = useMutation({
    mutationFn: ({ studentId, topic, count }: { studentId: number; topic: string; count: number }) =>
      apiRequest(`/api/admin/students/${studentId}/mark-solved`, { method: "POST", body: JSON.stringify({ topic, count }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      setSelectedStudent(null);
      setSelectedTopic("");
      setProblemCount(1);
      toast({ title: "Problems marked as solved!" });
    },
    onError: () => {
      toast({ title: "Failed to mark problems", variant: "destructive" });
    },
  });

  const resetProgressMutation = useMutation({
    mutationFn: (studentId: number) => apiRequest(`/api/admin/students/${studentId}/reset`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({ title: "Student progress reset successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to reset progress", variant: "destructive" });
    },
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.username || !newStudent.name) return;
    createStudentMutation.mutate(newStudent);
  };

  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const studentsArray = JSON.parse(bulkStudents);
      if (!Array.isArray(studentsArray)) {
        toast({ title: "Invalid format - must be an array", variant: "destructive" });
        return;
      }
      bulkCreateMutation.mutate(studentsArray);
    } catch (error) {
      toast({ title: "Invalid JSON format", variant: "destructive" });
    }
  };

  const handleMarkSolved = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedTopic || problemCount < 1) return;
    markSolvedMutation.mutate({ 
      studentId: selectedStudent, 
      topic: selectedTopic, 
      count: problemCount 
    });
  };

  const parseCSVStudents = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const students = lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      return {
        username: parts[0] || '',
        name: parts[1] || parts[0] || '',
        avatar: parts[2] || ''
      };
    }).filter(s => s.username);
    
    setBulkStudents(JSON.stringify(students, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-[#F4F4F4]" />
        <h2 className="text-2xl font-bold text-[#F4F4F4]">Admin Panel</h2>
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
              disabled={createStudentMutation.isPending}
              className="bg-white text-[#516395] hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              {createStudentMutation.isPending ? "Creating..." : "Create Student"}
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
                  className="bg-white text-[#516395] hover:bg-gray-100"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Start Bulk Upload
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 text-sm">
                <Badge variant="secondary" className="bg-white/10 text-[#F4F4F4]">
                  CSV: username,name,avatar_url
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-[#F4F4F4]">
                  JSON: Array of objects
                </Badge>
              </div>
              
              <div>
                <Label className="text-[#E6E6FA]">Paste CSV or JSON data:</Label>
                <Textarea
                  value={bulkStudents}
                  onChange={(e) => setBulkStudents(e.target.value)}
                  placeholder={`CSV example:\nstudent1,John Doe\nstudent2,Jane Smith\n\nJSON example:\n[{"username": "student1", "name": "John Doe"}]`}
                  className="bg-white/10 border-white/20 text-[#F4F4F4] placeholder:text-[#E6E6FA]/60 min-h-32"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    const csvExample = `student1,John Doe\nstudent2,Jane Smith\nstudent3,Bob Wilson`;
                    parseCSVStudents(csvExample);
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-[#E6E6FA] hover:bg-white/10"
                >
                  Load CSV Example
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    const jsonExample = [
                      { username: "student1", name: "John Doe" },
                      { username: "student2", name: "Jane Smith" }
                    ];
                    setBulkStudents(JSON.stringify(jsonExample, null, 2));
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-[#E6E6FA] hover:bg-white/10"
                >
                  Load JSON Example
                </Button>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleBulkUpload}
                  disabled={bulkCreateMutation.isPending || !bulkStudents}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {bulkCreateMutation.isPending ? "Uploading..." : "Upload Students"}
                </Button>
                <Button 
                  onClick={() => setShowBulkForm(false)}
                  variant="ghost"
                  className="text-[#F4F4F4] hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mark Problems as Solved */}
      <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Mark Problems as Solved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMarkSolved} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-[#E6E6FA]">Select Student</Label>
                <Select value={selectedStudent?.toString() || ""} onValueChange={(value) => setSelectedStudent(Number(value))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-[#F4F4F4]">
                    <SelectValue placeholder="Choose student" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#516395] border-white/20">
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()} className="text-[#F4F4F4] focus:bg-white/10">
                        {student.name} (@{student.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-[#E6E6FA]">Select Topic</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-[#F4F4F4]">
                    <SelectValue placeholder="Choose topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#516395] border-white/20">
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic} className="text-[#F4F4F4] focus:bg-white/10">
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-[#E6E6FA]">Number of Problems</Label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={problemCount}
                  onChange={(e) => setProblemCount(Number(e.target.value))}
                  className="bg-white/10 border-white/20 text-[#F4F4F4]"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={markSolvedMutation.isPending || !selectedStudent || !selectedTopic}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              {markSolvedMutation.isPending ? "Marking..." : "Mark as Solved"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Student Management */}
      <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Student Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback className="bg-white/20 text-[#F4F4F4] text-sm">
                      {student.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-[#E6E6FA]">@{student.username} • {student.totalSolved} solved</p>
                  </div>
                </div>
                <Button
                  onClick={() => resetProgressMutation.mutate(student.id)}
                  disabled={resetProgressMutation.isPending}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-500/20"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
            ))}
            {students.length > 5 && (
              <p className="text-center text-[#E6E6FA] text-sm">
                ...and {students.length - 5} more students
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}