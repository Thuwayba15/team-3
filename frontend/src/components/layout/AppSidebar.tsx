"use client";

import { Avatar, Button, Layout, Menu, Select, Typography, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getPlatformLanguageSelectOptions } from "@/i18n/platformLanguages";
import { useAuthActions, useAuthState } from "@/providers/auth";
import { useI18n } from "@/providers/i18n";
import { sessionService } from "@/services/sessions/sessionService";
import { NAVIGATION_BY_ROLE } from "@/config/navigation";
import type { AppRole } from "@/types/navigation";
import { useStyles } from "./AppSidebar.style";

const { Text } = Typography;

interface IAppSidebarProps {
    role: AppRole;
    isMobile?: boolean;
    onNavigate?: () => void;
}

/**
 * Role-aware sidebar that reads items from centralized navigation config.
 * Includes logo, language selector, navigation menu, user info, and logout.
 */
export const AppSidebar = ({ role, isMobile = false, onNavigate }: IAppSidebarProps) => {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, userId } = useAuthState();
    const { logout } = useAuthActions();
    const { currentLanguage, setLanguage, isLoading } = useI18n();
    const defaultUserLabel = t("header.defaultUser");
    const [displayName, setDisplayName] = useState(defaultUserLabel);
    const [emailAddress, setEmailAddress] = useState("-");
    const [userNameDraft, setUserNameDraft] = useState("");
    const languageOptions = useMemo(() => getPlatformLanguageSelectOptions(), []);

    useEffect(() => {
        if (!isAuthenticated || userId === null) {
            return;
        }

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
                setDisplayName(defaultUserLabel);
                setEmailAddress("-");
                setUserNameDraft("");
            });
    }, [defaultUserLabel, isAuthenticated, userId]);

    const profileInitial = useMemo(() => displayName.charAt(0).toUpperCase() || "U", [displayName]);

    const handleLogout = async (): Promise<void> => {
        await logout();
        router.replace("/");
    };

    const items = NAVIGATION_BY_ROLE[role];
    const activeItem =
        items.find((item) => pathname === item.path) ||
        items.find((item) => pathname.startsWith(item.path));

    useEffect(() => {
        items.forEach((item) => {
            router.prefetch(item.path);
        });
    }, [items, router]);

    const sidebarContent = (
        <>
            {/* Logo Section */}
            <div className={styles.logoSection}>
                <img 
                    src="https://firebasestorage.googleapis.com/v0/b/grade-12-life-sciences-st.firebasestorage.app/o/image.png?alt=media&token=7477da80-3128-4dc8-833b-92c432ea71b1" 
                    alt="UbuntuLearn Logo" 
                    className={styles.logoImage}
                />
                <Typography.Title level={4} className={styles.brandTitle}>UbuntuLearn</Typography.Title>
            </div>

            {/* Language Selector */}
            <div className={styles.languageSection}>
                <Select
                    className={styles.languageSelect}
                    value={currentLanguage}
                    options={languageOptions}
                    aria-label={t("header.language")}
                    loading={isLoading}
                    onChange={(languageCode) => {
                        void setLanguage(languageCode).catch(() => {
                            // keep the selector silent on update failure
                        });
                    }}
                />
            </div>

            {/* Navigation Menu */}
            <Menu
                mode="inline"
                className={styles.menu}
                selectedKeys={activeItem ? [activeItem.key] : []}
                items={items.map((item) => {
                    const Icon = item.icon;

                    return {
                        key: item.key,
                        icon: <Icon />,
                        label: (
                            <Link href={item.path} prefetch onClick={() => onNavigate?.()}>
                                {t(item.label)}
                            </Link>
                        ),
                    };
                })}
                onClick={({ key }) => {
                    const target = items.find((item) => item.key === key);
                    if (target) {
                        onNavigate?.();
                    }
                }}
            />

            {/* User Info and Logout at Bottom */}
            <div className={styles.userSection}>
                <Dropdown
                    trigger={["click"]}
                    dropdownRender={() => (
                        <div className={styles.profileDropdown}>
                            <div className={styles.profileRow}>
                                <Text className={styles.profileLabel}>{t("header.email")}</Text>
                                <Text className={styles.profileValue}>{emailAddress}</Text>
                            </div>

                            <div className={styles.profileRow}>
                                <Text className={styles.profileLabel}>{t("header.username")}</Text>
                                <Text className={styles.profileValue}>{userNameDraft}</Text>
                            </div>
                        </div>
                    )}
                >
                    <button type="button" className={styles.userWrap} aria-label={t("header.openUserMenu")}>
                        <Avatar icon={<UserOutlined />} className={styles.userAvatar}>{profileInitial}</Avatar>
                        <Text className={styles.userName}>{displayName}</Text>
                    </button>
                </Dropdown>

                <Button 
                    type="link" 
                    icon={<LogoutOutlined />} 
                    onClick={handleLogout} 
                    className={styles.logoutButton}
                >
                    {t("header.logout")}
                </Button>
            </div>
        </>
    );

    if (isMobile) {
        return (
            <div className={styles.mobileSidebar}>
                <div className={styles.mobileHeader}>
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        className={styles.mobileMenuButton}
                        onClick={onNavigate}
                    />
                </div>
                {sidebarContent}
            </div>
        );
    }

    return (
        <Layout.Sider width={260} className={styles.sidebar}>
            {sidebarContent}
        </Layout.Sider>
    );
};
