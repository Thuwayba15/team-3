"use client";

import {
    BookOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    RiseOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, Progress, Row, Tag, Typography } from "antd";
import { useStyles } from "./styles";

const { Text } = Typography;

const CHILD = { name: "Thabo", grade: 10, initials: "TM" };

const STATS = [
    { icon: TrophyOutlined, value: "78%",    label: "Overall Average",      badge: "Good standing" },
    { icon: BookOutlined,   value: "24",     label: "Lessons Completed" },
    { icon: ClockCircleOutlined, value: "4h 15m", label: "Time Spent (This Week)" },
];

const SUBJECTS = [
    { name: "Mathematics",       percent: 82 },
    { name: "Physical Sciences", percent: 75 },
    { name: "Life Sciences",     percent: 60 },
    { name: "English",           percent: 88 },
];

const ALERTS = [
    {
        title: "Struggling with Life Sciences",
        description: "Thabo has scored below 60% on the last two quizzes regarding Cell Structure. The AI Tutor has recommended a review module.",
    },
];

const ACTIVITY = [
    { title: "Completed Math Quiz",  time: "Today, 2:30 PM",     score: "85%",    tag: null },
    { title: "Chatted with AI Tutor", time: "Yesterday, 4:15 PM", score: null,     tag: "Physics" },
];

/** Parent dashboard — child progress overview with alerts and recent activity. */
export default function ParentDashboardPage() {
    const { styles } = useStyles();

    return (
        <div>
            {/* Page header */}
            <div className={styles.pageHeader}>
                <div>
                    <Typography.Title level={2} style={{ marginBottom: 0 }}>Parent Dashboard</Typography.Title>
                    <Text type="secondary">Monitoring progress for Thabo Mokoena</Text>
                </div>
                <div className={styles.childBadge}>
                    <Avatar className={styles.childAvatar}>{CHILD.initials}</Avatar>
                    <Text className={styles.childName}>{CHILD.name} (Grade {CHILD.grade})</Text>
                </div>
            </div>

            {/* Stat cards */}
            <Row gutter={[16, 16]} className={styles.statsRow}>
                {STATS.map(({ icon: Icon, value, label, badge }) => (
                    <Col key={label} xs={24} md={8}>
                        <Card className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <Icon className={styles.statIcon} />
                                {badge && (
                                    <span className={styles.standingBadge}>
                                        <RiseOutlined /> {badge}
                                    </span>
                                )}
                            </div>
                            <div className={styles.statValue}>{value}</div>
                            <div className={styles.statLabel}>{label}</div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Subject progress + alerts/activity */}
            <Row gutter={[16, 16]}>
                {/* Subject Progress */}
                <Col xs={24} lg={14}>
                    <Card title="Subject Progress" className={styles.subjectCard}>
                        {SUBJECTS.map(({ name, percent }) => (
                            <div key={name} className={styles.subjectRow}>
                                <div className={styles.subjectHeader}>
                                    <span>{name}</span>
                                    <span
                                        className={styles.subjectPercent}
                                        style={{ color: percent < 65 ? "#fa8c16" : "#00b8a9" }}
                                    >
                                        {percent}%
                                    </span>
                                </div>
                                <Progress
                                    percent={percent}
                                    showInfo={false}
                                    strokeColor="#00b8a9"
                                />
                            </div>
                        ))}
                    </Card>
                </Col>

                {/* Alerts + Activity */}
                <Col xs={24} lg={10}>
                    {/* Recent Alerts */}
                    <Card title="Recent Alerts" className={styles.alertCard}>
                        {ALERTS.map(({ title, description }) => (
                            <div key={title} className={styles.alertItem}>
                                <ExclamationCircleOutlined className={styles.alertIcon} />
                                <div>
                                    <Text className={styles.alertTitle}>{title}</Text>
                                    <Text className={styles.alertDesc}>{description}</Text>
                                    <Button type="link" className={styles.alertLink}>View Details</Button>
                                </div>
                            </div>
                        ))}
                    </Card>

                    {/* Recent Activity */}
                    <Card title="Recent Activity" className={styles.activityCard}>
                        {ACTIVITY.map(({ title, time, score, tag }) => (
                            <div key={title} className={styles.activityItem}>
                                <div className={styles.activityInfo}>
                                    <span className={styles.activityTitle}>{title}</span>
                                    <span className={styles.activityTime}>{time}</span>
                                </div>
                                {score && <span className={styles.activityScore}>{score}</span>}
                                {tag && <Tag className={styles.activityTag}>{tag}</Tag>}
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
