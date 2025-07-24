// Student Management Service
// Handles all student data operations

export class StudentManager {
  constructor() {
    this.students = new Map();
    this.nextId = 1;
  }

  async getAllStudents() {
    return Array.from(this.students.values());
  }

  async getStudentById(id) {
    return this.students.get(id) || null;
  }

  async getStudentByUsername(username) {
    return Array.from(this.students.values()).find(s => s.username === username) || null;
  }

  async addStudent(name, username) {
    const student = {
      id: this.nextId++,
      name: name.trim(),
      username: username.trim(),
      totalSolved: 0,
      difficultyStats: { easy: 0, medium: 0, hard: 0 },
      topicProgress: {},
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      profileUrl: `https://takeuforward.org/profile/${username}`
    };

    this.students.set(student.id, student);
    console.log(`✅ Added student: ${name} (${username})`);
    return student;
  }

  async updateStudentData(id, profileData) {
    const student = this.students.get(id);
    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }

    const updatedStudent = {
      ...student,
      totalSolved: profileData.totalSolved || 0,
      difficultyStats: profileData.difficultyStats || { easy: 0, medium: 0, hard: 0 },
      topicProgress: profileData.topicProgress || {},
      lastUpdated: new Date().toISOString()
    };

    this.students.set(id, updatedStudent);
    console.log(`📊 Updated ${student.name}: ${updatedStudent.totalSolved} problems`);
    return updatedStudent;
  }

  async deleteStudent(id) {
    const student = this.students.get(id);
    if (!student) {
      return false;
    }

    this.students.delete(id);
    console.log(`🗑️ Deleted student: ${student.name} (${student.username})`);
    return true;
  }

  async resetStudentProgress(id) {
    const student = this.students.get(id);
    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }

    const resetStudent = {
      ...student,
      totalSolved: 0,
      difficultyStats: { easy: 0, medium: 0, hard: 0 },
      topicProgress: {},
      lastUpdated: new Date().toISOString()
    };

    this.students.set(id, resetStudent);
    console.log(`🔄 Reset progress for: ${student.name}`);
    return resetStudent;
  }

  // Get students by performance
  async getTopPerformers(limit = 5) {
    const students = Array.from(this.students.values());
    return students
      .sort((a, b) => b.totalSolved - a.totalSolved)
      .slice(0, limit);
  }

  // Get class statistics
  async getClassStatistics() {
    const students = Array.from(this.students.values());
    
    if (students.length === 0) {
      return {
        totalStudents: 0,
        averageProblems: 0,
        totalProblems: 0,
        topPerformer: null
      };
    }

    const totalProblems = students.reduce((sum, s) => sum + s.totalSolved, 0);
    const averageProblems = Math.round(totalProblems / students.length);
    const topPerformer = students.reduce((top, current) => 
      current.totalSolved > top.totalSolved ? current : top
    );

    return {
      totalStudents: students.length,
      averageProblems,
      totalProblems,
      topPerformer
    };
  }

  // Export student data
  async exportStudentData() {
    const students = Array.from(this.students.values());
    return {
      exportedAt: new Date().toISOString(),
      studentCount: students.length,
      students: students.map(student => ({
        id: student.id,
        name: student.name,
        username: student.username,
        totalSolved: student.totalSolved,
        difficultyStats: student.difficultyStats,
        topicProgress: student.topicProgress,
        lastUpdated: student.lastUpdated,
        profileUrl: student.profileUrl
      }))
    };
  }

  // Import student data
  async importStudentData(exportData) {
    if (!exportData.students || !Array.isArray(exportData.students)) {
      throw new Error('Invalid export data format');
    }

    let importedCount = 0;
    for (const studentData of exportData.students) {
      try {
        const student = {
          id: this.nextId++,
          name: studentData.name,
          username: studentData.username,
          totalSolved: studentData.totalSolved || 0,
          difficultyStats: studentData.difficultyStats || { easy: 0, medium: 0, hard: 0 },
          topicProgress: studentData.topicProgress || {},
          createdAt: new Date().toISOString(),
          lastUpdated: studentData.lastUpdated || new Date().toISOString(),
          profileUrl: studentData.profileUrl || `https://takeuforward.org/profile/${studentData.username}`
        };

        this.students.set(student.id, student);
        importedCount++;
      } catch (error) {
        console.error(`Failed to import student ${studentData.name}:`, error);
      }
    }

    console.log(`📥 Imported ${importedCount} students`);
    return importedCount;
  }
}