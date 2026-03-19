"use client";

import {Layout, Menu, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { NAVIGATION_BY_ROLE } from "@/config/navigation";
import type { AppRole } from "@/types/navigation";
import { useStyles } from "./AppSidebar.style";

interface IAppSidebarProps {
    role: AppRole;
    isMobile?: boolean;
    onNavigate?: () => void;
}

/**
 * Role-aware sidebar that reads items from centralized navigation config.
 * Includes a role label at the top and a Help Center section at the bottom.
 */
export const AppSidebar = ({ role, isMobile = false, onNavigate }: IAppSidebarProps) => {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();

    const items = NAVIGATION_BY_ROLE[role];
    const activeItem =
        items.find((item) => pathname === item.path) ||
        items.find((item) => pathname.startsWith(item.path));

    const sidebarContent = (
        <>
            <div className={styles.roleLabel}>
                <Typography.Text className={styles.roleLabelText}>
                    {t(`sidebar.${role}`).toLowerCase()} &nbsp; {t("common.menu")}
                </Typography.Text>
            </div>

            <Menu
                mode="inline"
                className={styles.menu}
                selectedKeys={activeItem ? [activeItem.key] : []}
                items={items.map((item) => {
                    const Icon = item.icon;

                    return {
                        key: item.key,
                        icon: <Icon />,
                        label: t(item.label),
                    };
                })}
                onClick={({ key }) => {
                    const target = items.find((item) => item.key === key);
                    if (target) {
                        router.push(target.path);
                        onNavigate?.();
                    }
                }}
            />
        </>
    );

    if (isMobile) {
        return <div className={styles.mobileSidebar}>{sidebarContent}</div>;
    }

    return (
        <Layout.Sider width={260} className={styles.sidebar}>
            {sidebarContent}
        </Layout.Sider>
    );
};
