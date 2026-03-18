"use client";

import type { ReactNode } from "react";
import { withRole } from "@/components/hoc/withRole";

interface ITutorLayoutProps {
    children: ReactNode;
}

function TutorLayout({ children }: ITutorLayoutProps) {
    return <>{children}</>;
}

export default withRole<ITutorLayoutProps>(["tutor"])(TutorLayout);
