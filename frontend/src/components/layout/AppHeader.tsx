"use client";

import { BellOutlined, DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Layout, Select, Typography } from "antd";
import type { MenuProps } from "antd";
import { LANGUAGE_OPTIONS, ROLE_LABELS, ROLE_OPTIONS } from "@/config/roles";
import type { AppRole } from "@/types/navigation";
import { useStyles } from "./AppHeader.style";

const { Text } = Typography;

interface IAppHeaderProps {
    role: AppRole;
    onRoleChange: (role: AppRole) => void;
}

/**
 * Global dashboard header used across all role routes.
 */
export const AppHeader = ({ role, onRoleChange }: IAppHeaderProps) => {
    const { styles } = useStyles();

    const userMenuItems: MenuProps["items"] = [
        { key: "profile", label: "Profile" },
        { key: "account", label: "Account" },
    ];

    return (
        <Layout.Header className={styles.header}>
            <div className={styles.brand}>
                <Avatar shape="square" size={34} className={styles.logoAvatar}>
                    U
                </Avatar>
                <Typography.Title level={4}>UbuntuLearn</Typography.Title>
            </div>

            <div className={styles.controls}>
                <Select
                    className={styles.select}
                    defaultValue="en"
                    options={LANGUAGE_OPTIONS}
                    aria-label="Language"
                />

                <Select<AppRole>
                    className={styles.select}
                    value={role}
                    options={ROLE_OPTIONS}
                    onChange={onRoleChange}
                    aria-label="Demo role"
                />

                <Badge dot>
                    <Button type="text" icon={<BellOutlined />} className={styles.iconButton} aria-label="Notifications" />
                </Badge>

                <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                    <div className={styles.userWrap}>
                        <Avatar icon={<UserOutlined />} />
                        <Text>{ROLE_LABELS[role]} Demo</Text>
                        <DownOutlined />
                    </div>
                </Dropdown>

                <Button type="link" icon={<LogoutOutlined />}>
                    Logout
                </Button>
            </div>
        </Layout.Header>
    );
};
