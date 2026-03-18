"use client";

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
    WarningOutlined
} from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import { useState } from "react";
import { useStyles } from "./styles";

const { Text } = Typography;

type AlertCategory = "all" | "academic" | "activity" | "system";
type AlertType = "warning" | "reminder" | "success" | "info";

interface IAlert {
    id: number;
    type: AlertType;
    category: AlertCategory;
    title: string;
    description: string;
    when: string;
    actions: ("view" | "dismiss")[];
}

const ALERTS: IAlert[] = [
    {
        id: 1,
        type: "warning",
        category: "academic",
        title: "Low Quiz Score",
        description: "Thabo scored 38% on Life Sciences: Cell Structure quiz.",
        when: "2 hours ago",
        actions: ["view", "dismiss"],
    },
    {
        id: 2,
        type: "reminder",
        category: "activity",
        title: "Missed Study Session",
        description: "Thabo hasn't logged in for 2 days. Consistent practice is key to mastery.",
        when: "1 day ago",
        actions: ["dismiss"],
    },
    {
        id: 3,
        type: "success",
        category: "academic",
        title: "Achievement Unlocked",
        description: "Thabo mastered Algebraic Expressions!",
        when: "2 days ago",
        actions: [],
    },
    {
        id: 4,
        type: "warning",
        category: "academic",
        title: "Intervention Recommended",
        description: "Teacher flagged Thabo for extra help with Fractions.",
        when: "3 days ago",
        actions: ["view"],
    },
    {
        id: 5,
        type: "info",
        category: "system",
        title: "New Module Available",
        description: "Physical Sciences: Electricity module is now available.",
        when: "4 days ago",
        actions: [],
    },
    {
        id: 6,
        type: "success",
        category: "academic",
        title: "Quiz Passed",
        description: "Thabo scored 85% on Mathematics: Linear Equations.",
        when: "5 days ago",
        actions: [],
    },
    {
        id: 7,
        type: "reminder",
        category: "activity",
        title: "Study Reminder",
        description: "Thabo has a Physics quiz due tomorrow.",
        when: "6 days ago",
        actions: [],
    },
];

const ICON_MAP: Record<AlertType, React.ReactNode> = {
    warning:  <WarningOutlined />,
    reminder: <ClockCircleOutlined />,
    success:  <CheckCircleOutlined />,
    info:     <InfoCircleOutlined />,
};

const COLOR_MAP: Record<AlertType, string> = {
    warning:  "#ff4d4f",
    reminder: "#faad14",
    success:  "#52c41a",
    info:     "#1677ff",
};

const TABS: { key: AlertCategory; label: string }[] = [
    { key: "all",      label: "All" },
    { key: "academic", label: "Academic" },
    { key: "activity", label: "Activity" },
    { key: "system",   label: "System" },
];

export default function ParentAlertsPage() {
    const { styles } = useStyles();
    const [activeTab, setActiveTab] = useState<AlertCategory>("all");
    const [dismissed, setDismissed] = useState<Set<number>>(new Set());

    const visible = ALERTS.filter(
        (a) => !dismissed.has(a.id) && (activeTab === "all" || a.category === activeTab)
    );

    return (
        <div>
            {/* Page header */}
            <div className={styles.pageHeader}>
                <Typography.Title level={2} style={{ marginBottom: 0 }}>
                    Alerts &amp; Notifications
                </Typography.Title>
                <Text type="secondary">Stay updated on Thabo&apos;s learning journey</Text>
            </div>

            {/* Filter tabs */}
            <div className={styles.tabs}>
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`${styles.tab} ${activeTab === key ? styles.tabActive : ""}`}
                        onClick={() => setActiveTab(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Alert list */}
            <div className={styles.alertList}>
                {visible.map(({ id, type, title, description, when, actions }) => {
                    const color = COLOR_MAP[type];
                    return (
                        <Card key={id} className={styles.alertCard}>
                            <div className={styles.alertInner}>
                                <div
                                    className={styles.alertIcon}
                                    style={{ color, background: color + "18" }}
                                >
                                    {ICON_MAP[type]}
                                </div>
                                <div className={styles.alertBody}>
                                    <div className={styles.alertTitle}>{title}</div>
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        {description}
                                    </Text>
                                    {actions.length > 0 && (
                                        <div className={styles.alertActions}>
                                            {actions.includes("view") && (
                                                <Button type="link" className={styles.actionLink}>
                                                    View Details
                                                </Button>
                                            )}
                                            {actions.includes("dismiss") && (
                                                <Button
                                                    type="link"
                                                    className={styles.dismissLink}
                                                    onClick={() =>
                                                        setDismissed((prev) => new Set([...prev, id]))
                                                    }
                                                >
                                                    Dismiss
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <Text type="secondary" className={styles.alertWhen}>
                                    {when}
                                </Text>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
