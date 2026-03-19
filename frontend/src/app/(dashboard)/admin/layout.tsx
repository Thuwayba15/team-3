"use client";

import type { ReactNode } from "react";
import { withRole } from "@/components/hoc/withRole";

interface IAdminLayoutProps {
    children: ReactNode;
}

function AdminLayout({ children }: IAdminLayoutProps) {
    return <>{children}</>;
}

export default withRole<IAdminLayoutProps>(["admin"])(AdminLayout);
