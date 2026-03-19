import { beforeEach, describe, expect, it, vi } from "vitest";
import { studentAssessmentService } from "@/services/student/studentAssessmentService";
import { studentLearningPathService } from "@/services/student/studentLearningPathService";
import { studentSubjectService } from "@/services/student/studentSubjectService";

const { apiClientMock } = vi.hoisted(() => ({
    apiClientMock: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

vi.mock("@/lib/api/client", () => ({
    apiClient: apiClientMock,
}));

describe("student learning services", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("maps subject path envelopes", async () => {
        apiClientMock.get.mockResolvedValueOnce({
            data: {
                result: {
                    subjectId: "subject-1",
                    subjectName: "Mathematics",
                    gradeLevel: "Grade 10",
                    overallProgressPercent: 55,
                    recommendedAction: "Continue with your current lesson.",
                    topics: [],
                },
            },
        });

        const result = await studentLearningPathService.getSubjectPath("subject-1");

        expect(apiClientMock.get).toHaveBeenCalledWith("/api/services/app/StudentLearningPath/GetSubjectPath", {
            params: { subjectId: "subject-1" },
        });
        expect(result.subjectName).toBe("Mathematics");
    });

    it("maps student-safe assessments and lesson lookups", async () => {
        apiClientMock.get
            .mockResolvedValueOnce({
                data: {
                    result: {
                        assessmentId: "assessment-1",
                        subjectId: "subject-1",
                        topicId: "topic-1",
                        lessonId: null,
                        subjectName: "Mathematics",
                        topicName: "Exponents",
                        title: "Exponent Diagnostic",
                        assessmentType: 1,
                        difficultyLevel: 2,
                        totalMarks: 10,
                        languageCode: "en",
                        questions: [],
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    result: {
                        id: "lesson-1",
                        topicId: "topic-1",
                        title: "Exponents",
                        summary: "Summary",
                        learningObjective: "Objective",
                        revisionSummary: "Revision",
                        difficultyLevel: 2,
                        estimatedMinutes: 25,
                        isPublished: true,
                        translations: [],
                    },
                },
            });

        const assessment = await studentAssessmentService.getAssessment("assessment-1");
        const lesson = await studentSubjectService.getLesson("lesson-1");

        expect(assessment.assessmentType).toBe(1);
        expect(lesson.title).toBe("Exponents");
        expect(apiClientMock.get).toHaveBeenNthCalledWith(1, "/api/services/app/StudentAssessment/GetAssessment", {
            params: { assessmentId: "assessment-1" },
        });
        expect(apiClientMock.get).toHaveBeenNthCalledWith(2, "/api/services/app/StudentSubject/GetLesson", {
            params: { lessonId: "lesson-1" },
        });
    });
});
