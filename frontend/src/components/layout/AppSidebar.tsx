"use client";

import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { NAVIGATION_BY_ROLE } from "@/config/navigation";
import { ROLE_LABELS } from "@/config/roles";
import type { AppRole } from "@/types/navigation";
import { useStyles } from "./AppSidebar.style";

interface IAppSidebarProps {
    role: AppRole;
}

/**
 * Role-aware sidebar that reads items from centralized navigation config.
 * Includes a role label at the top and a Help Center section at the bottom.
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
            <div className={styles.roleLabel}>
                <Typography.Text className={styles.roleLabelText}>
                    {ROLE_LABELS[role].toLowerCase()} &nbsp; Menu
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

            <div className={styles.helpSection}>
                <QuestionCircleOutlined className={styles.helpIcon} />
                <Typography.Text strong className={styles.helpTitle}>Need Help?</Typography.Text>
                <Typography.Text className={styles.helpSubtitle}>Contact support or view guides.</Typography.Text>
                <Button block className={styles.helpButton}>Help Center</Button>
            </div>
        </Layout.Sider>
    );
};
