"use client";

import type { ReactNode } from "react";
import { StudentDashboardProvider } from "@/providers/student";

interface IStudentDashboardLayoutProps {
    children: ReactNode;
}

export default function StudentDashboardLayout({ children }: IStudentDashboardLayoutProps) {
    return <StudentDashboardProvider>{children}</StudentDashboardProvider>;
}
