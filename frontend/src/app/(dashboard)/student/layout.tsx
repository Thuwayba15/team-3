"use client";

import type { ReactNode } from "react";
import { withRole } from "@/components/hoc/withRole";

interface IStudentLayoutProps {
    children: ReactNode;
}

function StudentLayout({ children }: IStudentLayoutProps) {
    return <>{children}</>;
}

export default withRole<IStudentLayoutProps>(["student"])(StudentLayout);
