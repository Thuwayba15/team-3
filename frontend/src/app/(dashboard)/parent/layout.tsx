"use client";

import type { ReactNode } from "react";
import { withRole } from "@/components/hoc/withRole";

interface IParentLayoutProps {
    children: ReactNode;
}

function ParentLayout({ children }: IParentLayoutProps) {
    return <>{children}</>;
}

export default withRole<IParentLayoutProps>(["parent"])(ParentLayout);
