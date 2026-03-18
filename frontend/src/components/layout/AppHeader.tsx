"use client";

import { BellOutlined, DownOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Input, Layout, Select, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LANGUAGE_OPTIONS } from "@/config/roles";
import { useAuthActions, useAuthState } from "@/providers/auth";
import { sessionService } from "@/services/sessions/sessionService";
import { userService, type IUser } from "@/services/users/userService";
import { useStyles } from "./AppHeader.style";

const { Text } = Typography;

interface IAppHeaderProps {
    onOpenNavigation: () => void;
    isMobile: boolean;
}

/**
 * Global dashboard header used across all role routes.
 */
export const AppHeader = ({ onOpenNavigation, isMobile }: IAppHeaderProps) => {
    const { styles } = useStyles();
    const router = useRouter();
    const { isAuthenticated, userId } = useAuthState();
    const { logout } = useAuthActions();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isSavingUserName, setIsSavingUserName] = useState(false);
    const [displayName, setDisplayName] = useState("User");
    const [emailAddress, setEmailAddress] = useState("-");
    const [userNameDraft, setUserNameDraft] = useState("");
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);

    useEffect(() => {
        if (!isAuthenticated || userId === null) {
            return;
        }

        setIsProfileLoading(true);

        Promise.all([
            sessionService.getCurrentLoginInformations(),
            userService.getById(userId),
        ])
            .then(([sessionInfo, user]) => {
                const sessionUser = sessionInfo.user;
                const resolvedName = sessionUser
                    ? `${sessionUser.name} ${sessionUser.surname}`.trim()
                    : user.fullName;

                setDisplayName(resolvedName || user.userName);
                setEmailAddress(sessionUser?.emailAddress || user.emailAddress || "-");
                setUserNameDraft(user.userName);
                setCurrentUser(user);
            })
            .catch(() => {
                sessionService.getCurrentLoginInformations()
                    .then((sessionInfo) => {
                        const sessionUser = sessionInfo.user;
                        if (!sessionUser) {
                            return;
                        }

                        const resolvedName = `${sessionUser.name} ${sessionUser.surname}`.trim();
                        setDisplayName(resolvedName || sessionUser.userName);
                        setEmailAddress(sessionUser.emailAddress || "-");
                        setUserNameDraft(sessionUser.userName || "");
                    })
                    .catch(() => {
                        setDisplayName("User");
                        setEmailAddress("-");
                        setUserNameDraft("");
                    });
            })
            .finally(() => setIsProfileLoading(false));
    }, [isAuthenticated, userId]);

    const profileInitial = useMemo(() => displayName.charAt(0).toUpperCase() || "U", [displayName]);

    const handleSaveUserName = async (): Promise<void> => {
        const nextUserName = userNameDraft.trim();

        if (!nextUserName) {
            messageApi.error("Username is required.");
            return;
        }

        if (!currentUser) {
            messageApi.error("Unable to update username for this account.");
            return;
        }

        if (nextUserName === currentUser.userName) {
            return;
        }

        setIsSavingUserName(true);

        try {
            const updated = await userService.update({
                ...currentUser,
                userName: nextUserName,
            });

            setCurrentUser(updated);
            setUserNameDraft(updated.userName);
            setDisplayName(updated.fullName || updated.userName);
            setEmailAddress(updated.emailAddress);
            messageApi.success("Username updated successfully.");
        } catch {
            messageApi.error("Failed to update username. Please try again.");
        } finally {
            setIsSavingUserName(false);
        }
    };

    const handleLogout = async (): Promise<void> => {
        await logout();
        router.replace("/");
    };

    return (
        <Layout.Header className={styles.header}>
            {messageContextHolder}

            <div className={styles.brandRow}>
                {isMobile && (
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        className={styles.iconButton}
                        aria-label="Open navigation"
                        onClick={onOpenNavigation}
                    />
                )}

                <div className={styles.brand}>
                    <Avatar shape="square" size={34} className={styles.logoAvatar}>
                        U
                    </Avatar>
                    <Typography.Title level={4} className={styles.brandTitle}>UbuntuLearn</Typography.Title>
                </div>
            </div>

            <div className={styles.controls}>
                <Select
                    className={styles.select}
                    defaultValue="en"
                    options={LANGUAGE_OPTIONS}
                    aria-label="Language"
                />

                <Badge dot>
                    <Button type="text" icon={<BellOutlined />} className={styles.iconButton} aria-label="Notifications" />
                </Badge>

                <Dropdown
                    trigger={["click"]}
                    dropdownRender={() => (
                        <div className={styles.profileDropdown}>
                            <div className={styles.profileRow}>
                                <Text className={styles.profileLabel}>Email</Text>
                                <Text className={styles.profileValue}>{emailAddress}</Text>
                            </div>

                            <div className={styles.profileRow}>
                                <Text className={styles.profileLabel}>Username</Text>
                                <Text className={styles.profileValue}>{userNameDraft}</Text>
                            </div>
                        </div>
                    )}
                >
                    <button type="button" className={styles.userWrap} aria-label="Open user profile menu">
                        <Avatar icon={<UserOutlined />} className={styles.userAvatar}>{profileInitial}</Avatar>
                        <Text>{displayName}</Text>
                        <DownOutlined />
                    </button>
                </Dropdown>

                <Button type="link" icon={<LogoutOutlined />} onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                </Button>
            </div>
        </Layout.Header>
    );
};
