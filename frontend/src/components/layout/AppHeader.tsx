"use client";

import { BellOutlined, DownOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Layout, Select, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPlatformLanguageSelectOptions } from "@/i18n/platformLanguages";
import { useAuthActions, useAuthState } from "@/providers/auth";
import { useI18n } from "@/providers/i18n";
import { sessionService } from "@/services/sessions/sessionService";
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
    const { t } = useTranslation();
    const router = useRouter();
    const { isAuthenticated, userId } = useAuthState();
    const { logout } = useAuthActions();
    const { currentLanguage, setLanguage, isLoading } = useI18n();
    const [displayName, setDisplayName] = useState(t("header.defaultUser"));
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
                setDisplayName(t("header.defaultUser"));
                setEmailAddress("-");
                setUserNameDraft("");
            });
    }, [isAuthenticated, t, userId]);

    const profileInitial = useMemo(() => displayName.charAt(0).toUpperCase() || "U", [displayName]);

    const handleLogout = async (): Promise<void> => {
        await logout();
        router.replace("/");
    };

    return (
        <Layout.Header className={styles.header}>
            <div className={styles.brandRow}>
                {isMobile && (
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        className={styles.iconButton}
                        aria-label={t("header.openNavigation")}
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

                <Badge dot>
                    <Button type="text" icon={<BellOutlined />} className={styles.iconButton} aria-label={t("header.notifications")} />
                </Badge>

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
                        <Text>{displayName}</Text>
                        <DownOutlined />
                    </button>
                </Dropdown>

                <Button type="link" icon={<LogoutOutlined />} onClick={handleLogout} className={styles.logoutButton}>
                    {t("header.logout")}
                </Button>
            </div>
        </Layout.Header>
    );
};
