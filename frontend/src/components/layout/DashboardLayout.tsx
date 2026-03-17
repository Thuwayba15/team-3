"use client";

import { Layout } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";
import type { AppRole } from "@/types/navigation";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { useStyles } from "./DashboardLayout.style";

interface IDashboardLayoutProps {
    children: ReactNode;
}

const getRoleFromPath = (pathname: string): AppRole => {
    if (pathname.startsWith("/tutor")) {
        return "tutor";
    }

    if (pathname.startsWith("/parent")) {
        return "parent";
    }

    if (pathname.startsWith("/admin")) {
        return "admin";
    }

    return "student";
};

/**
 * Shared shell used by all dashboard pages.
 */
export const DashboardLayout = ({ children }: IDashboardLayoutProps) => {
    const { styles } = useStyles();
    const router = useRouter();
    const pathname = usePathname();
    const role = useMemo(() => getRoleFromPath(pathname), [pathname]);

    const handleRoleChange = (nextRole: AppRole): void => {
        router.push(`/${nextRole}/dashboard`);
    };

    return (
        <Layout className={styles.root}>
            <AppHeader role={role} onRoleChange={handleRoleChange} />

            <Layout className={styles.body}>
                <AppSidebar role={role} />

                <Layout.Content className={styles.content}>
                    <div className={styles.contentSurface}>{children}</div>
                </Layout.Content>
            </Layout>
        </Layout>
    );
};
