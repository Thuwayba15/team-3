"use client";

import { Button, Drawer, Grid, Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAuthState } from "@/providers/auth";
import type { AppRole } from "@/types/navigation";
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
    const pathname = usePathname();
    const router = useRouter();
    const screens = Grid.useBreakpoint();
    const { isAuthenticated, isLoading } = useAuthState();
    const role = useMemo(() => getRoleFromPath(pathname), [pathname]);
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const isMobile = !screens.lg;

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, isLoading, router]);

    if (!isAuthenticated) {
        return null;
    }

    const handleOpenNavigation = (): void => {
        setIsNavigationOpen(true);
    };

    const handleCloseNavigation = (): void => {
        setIsNavigationOpen(false);
    };

    return (
        <Layout className={styles.root}>
            <Layout className={styles.body}>
                {isMobile ? (
                    <Drawer
                        placement="left"
                        width={280}
                        open={isNavigationOpen}
                        onClose={handleCloseNavigation}
                        className={styles.navigationDrawer}
                        rootClassName={styles.navigationDrawerRoot}
                    >
                        <AppSidebar role={role} isMobile onNavigate={handleCloseNavigation} />
                    </Drawer>
                ) : (
                    <AppSidebar role={role} />
                )}

                <Layout.Content className={styles.content}>
                    <div className={styles.contentSurface}>
                        {isMobile && (
                            <div className={styles.mobileTopBar}>
                                <Button
                                    type="text"
                                    icon={<MenuOutlined />}
                                    className={styles.mobileMenuButton}
                                    aria-label="Open navigation"
                                    onClick={handleOpenNavigation}
                                />
                            </div>
                        )}
                        {children}
                    </div>
                </Layout.Content>
            </Layout>
        </Layout>
    );
};
