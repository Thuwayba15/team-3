"use client";

import { Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { NAVIGATION_BY_ROLE } from "@/config/navigation";
import type { AppRole } from "@/types/navigation";
import { useStyles } from "./AppSidebar.style";

interface IAppSidebarProps {
    role: AppRole;
}

/**
 * Role-aware sidebar that reads items from centralized navigation config.
 */
export const AppSidebar = ({ role }: IAppSidebarProps) => {
    const { styles } = useStyles();
    const router = useRouter();
    const pathname = usePathname();

    const items = NAVIGATION_BY_ROLE[role];
    const activeItem =
        items.find((item) => pathname === item.path) ||
        items.find((item) => pathname.startsWith(item.path));

    return (
        <Layout.Sider width={260} className={styles.sidebar}>
            <Menu
                mode="inline"
                className={styles.menu}
                selectedKeys={activeItem ? [activeItem.key] : []}
                items={items.map((item) => {
                    const Icon = item.icon;

                    return {
                        key: item.key,
                        icon: <Icon />,
                        label: item.label,
                    };
                })}
                onClick={({ key }) => {
                    const target = items.find((item) => item.key === key);
                    if (target) {
                        router.push(target.path);
                    }
                }}
            />
        </Layout.Sider>
    );
};
