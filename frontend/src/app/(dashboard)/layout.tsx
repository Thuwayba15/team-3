import { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout";

interface IDashboardRouteGroupLayoutProps {
    children: ReactNode;
}

export default function DashboardRouteGroupLayout({ children }: IDashboardRouteGroupLayoutProps) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
