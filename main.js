"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_mutex_1 = require("async-mutex");
class EssayGradingSystem {
    constructor() {
        this.essays = new Map();
        this.grades = new Map();
        this.mutex = new async_mutex_1.Mutex();
        this.semaphore = new async_mutex_1.Semaphore(1); // Limit concurrent grading to one essay at a time
    }
    submitEssay(studentId, essay) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.semaphore.acquire();
            try {
                console.log(`Student ${studentId} submitted essay: ${essay}`);
                this.essays.set(studentId, essay);
            }
            finally {
                this.semaphore.release();
            }
        });
    }
    gradeEssays() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.semaphore.acquire();
            try {
                console.log("Grading essays...");
                for (const [studentId, essay] of this.essays.entries()) {
                    const grade = this.gradeEssay(essay); // Simulate grading process
                    this.grades.set(studentId, grade);
                    console.log(`Essay graded for Student ${studentId}. Grade: ${grade}`);
                }
                this.essays.clear(); // Clear essays after grading
            }
            finally {
                this.semaphore.release();
            }
        });
    }
    gradeEssay(essay) {
        // Simulated grading process - just return a random grade between 1 and 100
        return Math.floor(Math.random() * 100) + 1;
    }
}
function simulateEssaySubmission(gradingSystem, studentId, essay) {
    return __awaiter(this, void 0, void 0, function* () {
        yield gradingSystem.submitEssay(studentId, essay);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const gradingSystem = new EssayGradingSystem();
        // Simulate multiple students submitting essays concurrently
        const submissions = [
            { studentId: 1, essay: "The Importance of Education in Modern Society" },
            { studentId: 2, essay: "The Impact of Technology on Education" },
            { studentId: 3, essay: "Challenges Faced by Students in Online Learning Environments" }
        ];
        const submissionPromises = submissions.map(submission => simulateEssaySubmission(gradingSystem, submission.studentId, submission.essay));
        yield Promise.all(submissionPromises);
        // Grade the submitted essays
        yield gradingSystem.gradeEssays();
    });
}
main();
