// Frontend-only TUF Class Tracker Demo
import { useState } from 'react';
import { useStudents } from '../hooks/useHardcodedData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Trash2, RefreshCw, TestTube, Users, Target, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function FrontendOnlyDemo() {
  const { students, isLoading, addStudent, deleteStudent, scrapeStudent, scrapeAllStudents, testScraping } = useStudents();
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [testUsername, setTestUsername] = useState('');
  const [isScrapingTest, setIsScrapingTest] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim()) {
      toast.error('Please enter both name and username');
      return;
    }

    try {
      await addStudent(newName.trim(), newUsername.trim());
      toast.success(`Student ${newName} added successfully!`);
      setNewName('');
      setNewUsername('');
    } catch (error) {
      toast.error('Failed to add student');
      console.error(error);
    }
  };

  const handleTestScraping = async () => {
    if (!testUsername.trim()) {
      toast.error('Please enter a username to test');
      return;
    }

    setIsScrapingTest(true);
    try {
      const result = await testScraping(testUsername.trim());
      setTestResult(result);
      toast.success(`Test scraping successful for ${testUsername}`);
    } catch (error) {
      toast.error('Test scraping failed');
      setTestResult({ error: error.message });
    } finally {
      setIsScrapingTest(false);
    }
  };

  const handleScrapeStudent = async (id: number, name: string) => {
    try {
      toast.info(`Scraping data for ${name}...`);
      await scrapeStudent(id);
      toast.success(`Data updated for ${name}`);
    } catch (error) {
      toast.error(`Failed to scrape data for ${name}`);
    }
  };

  const handleBulkScrape = async () => {
    try {
      toast.info('Starting bulk scraping...');
      await scrapeAllStudents();
      toast.success('Bulk scraping completed');
    } catch (error) {
      toast.error('Bulk scraping failed');
    }
  };

  const handleDeleteStudent = async (id: number, name: string) => {
    try {
      await deleteStudent(id);
      toast.success(`Student ${name} deleted`);
    } catch (error) {
      toast.error(`Failed to delete ${name}`);
    }
  };

  const totalSolved = students.reduce((sum, s) => sum + s.totalSolved, 0);
  const avgSolved = students.length > 0 ? Math.round(totalSolved / students.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">TUF Class Tracker</h1>
          <p className="text-gray-300">Frontend-Only • Vercel Ready • Real Data Scraping</p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Users className="w-4 h-4 mr-1" />
              {students.length} Students
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Target className="w-4 h-4 mr-1" />
              {totalSolved} Total Solved
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Award className="w-4 h-4 mr-1" />
              {avgSolved} Avg Problems
            </Badge>
          </div>
        </div>

        {/* Test Scraping */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Test Serverless Scraping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter TUF username (e.g., Volcaryx)"
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
              <Button 
                onClick={handleTestScraping} 
                disabled={isScrapingTest}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isScrapingTest ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Test'}
              </Button>
            </div>
            
            {testResult && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Student */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Add New Student</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStudent} className="flex gap-2">
              <Input
                placeholder="Student Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
              <Input
                placeholder="TUF Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Add Student
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Students ({students.length})</CardTitle>
            <Button 
              onClick={handleBulkScrape} 
              disabled={students.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Bulk Scrape
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-gray-400">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="text-center text-gray-400">No students added yet. Add some students to get started!</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                  <div key={student.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <a 
                          href={student.profileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          @{student.username}
                        </a>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleScrapeStudent(student.id, student.name)}
                          className="border-gray-600 hover:bg-gray-600"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          className="border-red-600 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Solved:</span>
                        <span className="font-semibold">{student.totalSolved}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <div className="text-green-400">{student.difficultyStats.easy}</div>
                          <div className="text-gray-400">Easy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400">{student.difficultyStats.medium}</div>
                          <div className="text-gray-400">Medium</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-400">{student.difficultyStats.hard}</div>
                          <div className="text-gray-400">Hard</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Updated: {new Date(student.lastUpdated).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deployment Info */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>✅ Deployment Ready</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-green-400">✓ Frontend-only architecture</p>
            <p className="text-green-400">✓ Serverless API with @sparticuz/chromium</p>
            <p className="text-green-400">✓ No database dependencies</p>
            <p className="text-green-400">✓ Real TUF data scraping</p>
            <p className="text-green-400">✓ Vercel deployment ready</p>
            <div className="mt-4 p-3 bg-gray-700 rounded text-sm">
              <strong>Deploy Command:</strong> <code>vercel deploy</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}