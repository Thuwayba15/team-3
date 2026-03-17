import type { AppRole, IRoleOption } from "@/types/navigation";

export const ROLE_LABELS: Record<AppRole, string> = {
    student: "Student",
    tutor: "Tutor",
    parent: "Parent",
    admin: "Administrator",
};

export const ROLE_OPTIONS: IRoleOption[] = [
    { label: ROLE_LABELS.student, value: "student" },
    { label: ROLE_LABELS.tutor, value: "tutor" },
    { label: ROLE_LABELS.parent, value: "parent" },
    { label: ROLE_LABELS.admin, value: "admin" },
];

export const LANGUAGE_OPTIONS = [
    { label: "English", value: "en" },
    { label: "IsiZulu", value: "zu" },
    { label: "Sesotho", value: "st"},
    { label: "Afrikaans", value: "af" }
];
