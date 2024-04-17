import { Semaphore, Mutex } from 'async-mutex';

class EssayGradingSystem {
  private essays: Map<number, string>;
  private grades: Map<number, number>;
  private mutex: Mutex;
  private semaphore: Semaphore;

  constructor() {
    this.essays = new Map();
    this.grades = new Map();
    this.mutex = new Mutex();
    this.semaphore = new Semaphore(1); // Limit concurrent grading to one essay at a time
  }

  async submitEssay(studentId: number, essay: string) {
    await this.semaphore.acquire();
    try {
      console.log(`Student ${studentId} submitted essay: ${essay}`);
      this.essays.set(studentId, essay);
    } finally {
      this.semaphore.release();
    }
  }

  async gradeEssays() {
    await this.semaphore.acquire();
    try {
      console.log("Grading essays...");
      for (const [studentId, essay] of this.essays.entries()) {
        const grade = this.gradeEssay(essay); // Simulate grading process
        this.grades.set(studentId, grade);
        console.log(`Essay graded for Student ${studentId}. Grade: ${grade}`);
      }
      this.essays.clear(); // Clear essays after grading
    } finally {
      this.semaphore.release();
    }
  }

  private gradeEssay(essay: string): number {
    return Math.floor(Math.random() * 100) + 1;
  }
}

async function simulateEssaySubmission(gradingSystem: EssayGradingSystem, studentId: number, essay: string) {
  await gradingSystem.submitEssay(studentId, essay);
}

async function main() {
  const gradingSystem = new EssayGradingSystem();
  const submissions = [
    { studentId: 1, essay: "The Importance of Education in Modern Society" },
    { studentId: 2, essay: "The Impact of Technology on Education" },
    { studentId: 3, essay: "Challenges Faced by Students in Online Learning Environments" }
  ];

  const submissionPromises = submissions.map(submission =>
    simulateEssaySubmission(gradingSystem, submission.studentId, submission.essay)
  );
  await Promise.all(submissionPromises);

  // Grade the submitted essays
  await gradingSystem.gradeEssays();
}

main();
