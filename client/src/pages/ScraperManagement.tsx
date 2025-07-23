import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, StopCircle, TestTube, Users, Clock, ArrowLeft, Bot } from "lucide-react";
import { useLocation } from "wouter";
import SimpleNavigation from "@/components/SimpleNavigation";
import { useStudents } from "@/hooks/useHardcodedData";

export default function ScraperManagement() {
  const [testUsername, setTestUsername] = useState("");
  const [isTestingScrape, setIsTestingScrape] = useState(false);
  const [isScraping, setIsScraping] = useState<number | null>(null);
  const [isBulkScraping, setIsBulkScraping] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { students, isLoading: studentsLoading } = useStudents();

  // Mock scraping functions that simulate the scraping process
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
      
      // Mock successful response
      toast({
        title: "Test Scraping Successful",
        description: `Successfully scraped profile for ${testUsername}. Total problems: 142, Easy: 65, Medium: 52, Hard: 25`,
      });
      setTestUsername("");
    } catch (error) {
      toast({
        title: "Test Scraping Failed",
        description: "Failed to scrape profile data. Please check the username.",
        variant: "destructive",
      });
    } finally {
      setIsTestingScrape(false);
    }
  };

  const handleScrapeStudent = async (studentId: number, studentName: string) => {
    setIsScraping(studentId);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Student Data Updated",
        description: `Successfully scraped and updated data for ${studentName}`,
      });
    } catch (error) {
      toast({
        title: "Scraping Failed",
        description: `Failed to scrape data for ${studentName}`,
        variant: "destructive",
      });
    } finally {
      setIsScraping(null);
    }
  };

  const handleBulkScrape = async () => {
    setIsBulkScraping(true);
    try {
      // Simulate bulk scraping delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Bulk Scraping Completed",
        description: `Successfully updated data for all ${students.length} students`,
      });
    } catch (error) {
      toast({
        title: "Bulk Scraping Failed",
        description: "Some students could not be updated. Please try individual scraping.",
        variant: "destructive",
      });
    } finally {
      setIsBulkScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E4057] via-[#516395] to-[#7209B7]">
      <SimpleNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-[#F4F4F4]" />
            <h1 className="text-2xl font-bold text-[#F4F4F4]">TUF Scraper Management</h1>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="border-white/20 text-[#F4F4F4] hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Alert className="bg-white/10 border-white/20 text-[#F4F4F4]">
          <TestTube className="w-4 h-4" />
          <AlertDescription className="text-[#E6E6FA]">
            <strong>Note:</strong> This is a demo version with simulated scraping. 
            In production, this would connect to the actual TUF platform to fetch real student progress data.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Scraping */}
          <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Test Scraping
              </CardTitle>
              <CardDescription className="text-[#E6E6FA]">
                Test the scraper with any TUF username to verify functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testUsername" className="text-[#E6E6FA]">TUF Username</Label>
                <Input
                  id="testUsername"
                  value={testUsername}
                  onChange={(e) => setTestUsername(e.target.value)}
                  placeholder="Enter TUF username (e.g., striver_79)"
                  className="bg-white/10 border-white/20 text-[#F4F4F4] placeholder:text-[#E6E6FA]/60"
                />
              </div>
              <Button
                onClick={handleTestScrape}
                disabled={isTestingScrape || !testUsername.trim()}
                className="w-full bg-white text-[#516395] hover:bg-gray-100"
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

          {/* Bulk Operations */}
          <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Bulk Operations
              </CardTitle>
              <CardDescription className="text-[#E6E6FA]">
                Update all students' data at once (runs in background)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="font-medium text-[#F4F4F4]">Total Students</p>
                  <p className="text-sm text-[#E6E6FA]">{students.length} registered</p>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-[#F4F4F4]">
                  {students.length}
                </Badge>
              </div>
              <Button
                onClick={handleBulkScrape}
                disabled={isBulkScraping || students.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isBulkScraping ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scraping All Students...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Scrape All Students
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Individual Student Scraping */}
        <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Individual Student Scraping
            </CardTitle>
            <CardDescription className="text-[#E6E6FA]">
              Update specific students' data individually
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#F4F4F4]" />
                <span className="ml-2 text-[#F4F4F4]">Loading students...</span>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-[#E6E6FA] mb-3" />
                <p className="text-[#E6E6FA]">No students found. Add students in the Admin panel first.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-[#F4F4F4] font-medium">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#F4F4F4]">{student.name}</h4>
                        <p className="text-sm text-[#E6E6FA]">@{student.username}</p>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-[#F4F4F4]">
                        {student.totalSolved || 0} solved
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="border-white/20 text-[#E6E6FA]"
                      >
                        Last updated: {new Date(student.lastUpdated || Date.now()).toLocaleDateString()}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleScrapeStudent(student.id, student.name)}
                      disabled={isScraping === student.id}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
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

        {/* Auto-scheduling Info */}
        <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Automated Scheduling
            </CardTitle>
            <CardDescription className="text-[#E6E6FA]">
              Configure automatic scraping schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="font-medium text-[#F4F4F4]">Daily Auto-Scraping</p>
                  <p className="text-sm text-[#E6E6FA]">Automatically update all students daily at 2:00 AM UTC</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-[#E6E6FA]">
                <strong>Note:</strong> In the production version, this would automatically scrape all student data 
                every day to keep progress tracking up-to-date without manual intervention.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}