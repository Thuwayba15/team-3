import { beforeEach, describe, expect, it, vi } from "vitest";
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

describe("studentSubjectService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("maps all-subject envelopes", async () => {
        apiClientMock.get.mockResolvedValueOnce({
            data: {
                result: [
                    {
                        id: "subject-1",
                        name: "Mathematics",
                        description: "Core maths subject",
                        gradeLevel: "Grade 10",
                        isActive: true,
                    },
                ],
            },
        });

        const result = await studentSubjectService.getAllSubjects();

        expect(apiClientMock.get).toHaveBeenCalledWith("/api/services/app/StudentSubject/GetAllSubjects");
        expect(result).toHaveLength(1);
        expect(result[0]?.name).toBe("Mathematics");
    });

    it("maps bulk enroll responses", async () => {
        apiClientMock.post.mockResolvedValueOnce({
            data: {
                result: {
                    enrolledSubjectIds: ["subject-1"],
                    alreadyEnrolledSubjectIds: ["subject-2"],
                    notFoundSubjectIds: [],
                },
            },
        });

        const result = await studentSubjectService.bulkEnroll({
            subjectIds: ["subject-1", "subject-2"],
        });

        expect(apiClientMock.post).toHaveBeenCalledWith("/api/services/app/StudentSubject/BulkEnroll", {
            subjectIds: ["subject-1", "subject-2"],
        });
        expect(result.enrolledSubjectIds).toEqual(["subject-1"]);
        expect(result.alreadyEnrolledSubjectIds).toEqual(["subject-2"]);
    });
});
