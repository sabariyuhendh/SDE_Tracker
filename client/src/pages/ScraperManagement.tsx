
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, StopCircle, TestTube, Users, Clock, ArrowLeft, Bot } from "lucide-react";
import { useStudents } from "@/hooks/useHardcodedData";

export default function ScraperManagement() {
  const [testUsername, setTestUsername] = useState("");
  const [isTestingScrape, setIsTestingScrape] = useState(false);
  const [isScraping, setIsScraping] = useState<number | null>(null);
  const [isBulkScraping, setIsBulkScraping] = useState(false);
  const [isAutoScraping, setIsAutoScraping] = useState(false);
  const [autoScrapingInterval, setAutoScrapingInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { students, isLoading: studentsLoading, updateStudent } = useStudents();

  // Check localStorage for auto-scraping state on component mount
  useEffect(() => {
    const savedAutoScraping = localStorage.getItem('autoScrapingEnabled');
    if (savedAutoScraping === 'true') {
      setIsAutoScraping(true);
    }
  }, []);

  // Auto-scrape newly added students
  useEffect(() => {
    if (isAutoScraping && students.length > 0) {
      // Check for students that were added in the last 5 seconds (new students)
      const recentStudents = students.filter(student => {
        if (!student.createdAt) return false;
        const timeDiff = Date.now() - new Date(student.createdAt).getTime();
        return timeDiff < 5000; // 5 seconds threshold
      });

      if (recentStudents.length > 0) {
        recentStudents.forEach(student => {
          setTimeout(() => {
            const scrapedData = generateMockScrapedData(student.username);
            
            // Calculate percentages
            Object.keys(scrapedData.topicProgress).forEach(topic => {
              const progress = scrapedData.topicProgress[topic as keyof typeof scrapedData.topicProgress];
              progress.percentage = Math.round((progress.solved / progress.total) * 100);
            });

            updateStudent(student.id, {
              totalSolved: scrapedData.totalSolved,
              difficultyStats: scrapedData.difficultyStats,
              topicProgress: scrapedData.topicProgress
            });

            toast({
              title: "Auto-Scraping New Student",
              description: `Automatically scraped data for new student: ${student.name}`,
            });
          }, 2000); // 2 second delay for new students
        });
      }
    }
  }, [students, isAutoScraping]);

  // Demo test scraping function (frontend-only)
  const handleTestScrape = async () => {
    if (!testUsername.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a TUF username to test",
        variant: "destructive",
      });
      return;
    }

    setIsTestingScrape(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Demo data for testing
      const demoData = {
        totalSolved: Math.floor(Math.random() * 200) + 50,
        difficultyStats: {
          easy: Math.floor(Math.random() * 80) + 20,
          medium: Math.floor(Math.random() * 60) + 15,
          hard: Math.floor(Math.random() * 30) + 5,
        }
      };

      toast({
        title: "Demo Test Scraping Successful",
        description: `Demo scrape for ${testUsername}. Total problems: ${demoData.totalSolved}, Easy: ${demoData.difficultyStats.easy}, Medium: ${demoData.difficultyStats.medium}, Hard: ${demoData.difficultyStats.hard}`,
      });
      setTestUsername("");
    } catch (error: any) {
      toast({
        title: "Test Scraping Failed",
        description: error.message || "Failed to scrape profile data. Please check the username.",
        variant: "destructive",
      });
    } finally {
      setIsTestingScrape(false);
    }
  };

  // Generate mock scrape data for individual student (frontend-only)
  const generateMockScrapedData = (username: string) => {
    const userSeed = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const easyCount = Math.floor(seededRandom(userSeed + 1) * 80) + 20;
    const mediumCount = Math.floor(seededRandom(userSeed + 2) * 60) + 15;
    const hardCount = Math.floor(seededRandom(userSeed + 3) * 40) + 5;

    return {
      totalSolved: easyCount + mediumCount + hardCount,
      difficultyStats: {
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount
      },
      topicProgress: {
        "Array": { solved: Math.floor(seededRandom(userSeed + 4) * 25), total: 25, percentage: 0 },
        "Matrix": { solved: Math.floor(seededRandom(userSeed + 5) * 6), total: 6, percentage: 0 },
        "String": { solved: Math.floor(seededRandom(userSeed + 6) * 15), total: 15, percentage: 0 },
        "Searching & Sorting": { solved: Math.floor(seededRandom(userSeed + 7) * 18), total: 18, percentage: 0 },
        "Linked List": { solved: Math.floor(seededRandom(userSeed + 8) * 14), total: 14, percentage: 0 },
        "Binary Trees": { solved: Math.floor(seededRandom(userSeed + 9) * 25), total: 25, percentage: 0 },
        "Binary Search Trees": { solved: Math.floor(seededRandom(userSeed + 10) * 10), total: 10, percentage: 0 },
        "Greedy": { solved: Math.floor(seededRandom(userSeed + 11) * 12), total: 12, percentage: 0 },
        "Backtracking": { solved: Math.floor(seededRandom(userSeed + 12) * 9), total: 9, percentage: 0 },
        "Stacks and Queues": { solved: Math.floor(seededRandom(userSeed + 13) * 12), total: 12, percentage: 0 },
        "Heap": { solved: Math.floor(seededRandom(userSeed + 14) * 6), total: 6, percentage: 0 },
        "Graph": { solved: Math.floor(seededRandom(userSeed + 15) * 15), total: 15, percentage: 0 },
        "Trie": { solved: Math.floor(seededRandom(userSeed + 16) * 6), total: 6, percentage: 0 },
        "Dynamic Programming": { solved: Math.floor(seededRandom(userSeed + 17) * 17), total: 17, percentage: 0 }
      }
    };
  };

  // Scrape individual student (frontend-only with mock data)
  const handleScrapeStudent = async (studentId: number, studentName: string, studentUsername: string) => {
    setIsScraping(studentId);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
      
      // Generate new mock data
      const scrapedData = generateMockScrapedData(studentUsername);
      
      // Calculate percentages
      Object.keys(scrapedData.topicProgress).forEach(topic => {
        const progress = scrapedData.topicProgress[topic as keyof typeof scrapedData.topicProgress];
        progress.percentage = Math.round((progress.solved / progress.total) * 100);
      });

      // Update student with new data
      updateStudent(studentId, {
        totalSolved: scrapedData.totalSolved,
        difficultyStats: scrapedData.difficultyStats,
        topicProgress: scrapedData.topicProgress
      });

      toast({
        title: "Student Data Updated",
        description: `Successfully scraped and updated data for ${studentName}. Total: ${scrapedData.totalSolved} problems`,
      });
    } catch (error: any) {
      toast({
        title: "Scraping Failed",
        description: error.message || `Failed to scrape data for ${studentName}`,
        variant: "destructive",
      });
    } finally {
      setIsScraping(null);
    }
  };

  // Bulk scrape all students (frontend-only with mock data)
  const handleBulkScrape = async () => {
    setIsBulkScraping(true);
    try {
      let successCount = 0;
      const totalStudents = students.length;
      
      // Process students in batches to avoid overwhelming the UI
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        
        // Generate new mock data for each student
        const scrapedData = generateMockScrapedData(student.username);
        
        // Calculate percentages
        Object.keys(scrapedData.topicProgress).forEach(topic => {
          const progress = scrapedData.topicProgress[topic as keyof typeof scrapedData.topicProgress];
          progress.percentage = Math.round((progress.solved / progress.total) * 100);
        });

        // Update student data
        updateStudent(student.id, {
          totalSolved: scrapedData.totalSolved,
          difficultyStats: scrapedData.difficultyStats,
          topicProgress: scrapedData.topicProgress
        });
        
        successCount++;
        
        // Add small delay between updates to simulate real scraping
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      toast({
        title: "Bulk Scraping Completed",
        description: `Successfully updated data for ${successCount}/${totalStudents} students`,
      });
    } catch (error: any) {
      toast({
        title: "Bulk Scraping Failed",
        description: error.message || "Failed to complete bulk scraping",
        variant: "destructive",
      });
    } finally {
      setIsBulkScraping(false);
    }
  };

  // Start auto scraping (frontend-only simulation)
  const handleStartAutoScraping = async () => {
    try {
      // Set up interval for demonstration (every 30 seconds instead of daily)
      const interval = setInterval(async () => {
        console.log('Auto-scraping: Updating all students...');
        
        // Update all students with fresh mock data
        students.forEach(student => {
          const scrapedData = generateMockScrapedData(student.username + Date.now()); // Add timestamp for variation
          
          // Calculate percentages
          Object.keys(scrapedData.topicProgress).forEach(topic => {
            const progress = scrapedData.topicProgress[topic as keyof typeof scrapedData.topicProgress];
            progress.percentage = Math.round((progress.solved / progress.total) * 100);
          });

          updateStudent(student.id, {
            totalSolved: scrapedData.totalSolved,
            difficultyStats: scrapedData.difficultyStats,
            topicProgress: scrapedData.topicProgress
          });
        });
        
        toast({
          title: "Auto-Scraping Update",
          description: `Automatically updated ${students.length} students`,
        });
      }, 30000); // 30 seconds for demo purposes

      setAutoScrapingInterval(interval);
      setIsAutoScraping(true);
      localStorage.setItem('autoScrapingEnabled', 'true');
      
      toast({
        title: "Auto-Scraping Started",
        description: "Auto-scraping is now active (updates every 30 seconds for demo)",
      });
    } catch (error: any) {
      toast({
        title: "Auto-Scraping Failed",
        description: error.message || "Failed to start auto-scraping",
        variant: "destructive",
      });
    }
  };

  // Stop auto scraping
  const handleStopAutoScraping = async () => {
    try {
      if (autoScrapingInterval) {
        clearInterval(autoScrapingInterval);
        setAutoScrapingInterval(null);
      }
      
      setIsAutoScraping(false);
      localStorage.setItem('autoScrapingEnabled', 'false');
      
      toast({
        title: "Auto-Scraping Stopped",
        description: "Auto-scraping has been disabled",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Stop Auto-Scraping",
        description: error.message || "Failed to stop auto-scraping",
        variant: "destructive",
      });
    }
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (autoScrapingInterval) {
        clearInterval(autoScrapingInterval);
      }
    };
  }, [autoScrapingInterval]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Note: Navigation is handled by the main Index.tsx component */}
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">TUF Scraper Management</h1>
          <p className="text-gray-300 text-lg">
            Manage TakeUForward profile scraping and data synchronization (Demo Mode)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Scraping */}
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Test Scraping (Demo)
              </CardTitle>
              <CardDescription className="text-gray-300">
                Demo interface for testing TUF username scraping functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testUsername" className="text-gray-300">TUF Username</Label>
                <Input
                  id="testUsername"
                  value={testUsername}
                  onChange={(e) => setTestUsername(e.target.value)}
                  placeholder="Enter TUF username (e.g., striver_79)"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                onClick={handleTestScrape}
                disabled={isTestingScrape || !testUsername.trim()}
                className="w-full bg-white text-black hover:bg-gray-200"
              >
                {isTestingScrape ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Scraper...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Scrape
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Auto Scraping */}
          <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Auto Scraping
                {isAutoScraping && <Badge className="bg-green-500 text-white">Active</Badge>}
              </CardTitle>
              <CardDescription className="text-[#E6E6FA]">
                Schedule automatic scraping for all students daily at 2 AM UTC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-white/5 border-white/20">
                <Bot className="h-4 w-4" />
                <AlertDescription className="text-[#E6E6FA]">
                  Auto-scraping will update all student profiles automatically every day at 2 AM UTC.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button
                  onClick={handleStartAutoScraping}
                  disabled={isAutoScraping}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Auto
                </Button>
                <Button
                  onClick={handleStopAutoScraping}
                  disabled={!isAutoScraping}
                  variant="destructive"
                  className="flex-1"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop Auto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Operations */}
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Bulk Operations (Demo)
            </CardTitle>
            <CardDescription className="text-gray-300">
              Demo interface for bulk student scraping operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleBulkScrape}
                disabled={isBulkScraping}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isBulkScraping ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scraping All...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Scrape All Students
                  </>
                )}
              </Button>
            </div>

            {/* Individual Student Scraping */}
            {studentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#E6E6FA]" />
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-[#E6E6FA] mb-2">Individual Student Scraping:</h4>
                {students.map((student: any) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <span className="font-medium">{student.name}</span>
                      <span className="text-[#E6E6FA] ml-2">(@{student.username})</span>
                    </div>
                    <Button
                      onClick={() => handleScrapeStudent(student.id, student.name, student.username)}
                      disabled={isScraping === student.id}
                      size="sm"
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      {isScraping === student.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Scraping...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Scrape
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
