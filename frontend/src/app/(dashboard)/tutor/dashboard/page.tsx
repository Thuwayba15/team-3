"use client";

import {
    AlertOutlined,
    BarChartOutlined,
    BookOutlined,
    BulbOutlined,
    PlusOutlined,
    RiseOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    Progress,
    Row,
    Tag,
    Typography,
} from "antd";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

const STATS = [
    { icon: TeamOutlined,    value: "32",  label: "Total Students",       badge: null },
    { icon: BarChartOutlined, value: "74%", label: "Average Class Score",  badge: "+3% this week", type: "trend" as const },
    { icon: AlertOutlined,   value: "5",   label: "Active Interventions", badge: "Needs attention", type: "warning" as const },
    { icon: BookOutlined,    value: "18",  label: "Modules Assigned",     badge: null },
];

const CLASS_PERFORMANCE = [
    { subject: "Mathematics",       percent: 74 },
    { subject: "Physical Sciences", percent: 68 },
    { subject: "Life Sciences",     percent: 81 },
    { subject: "English",           percent: 85 },
];

const AT_RISK_STUDENTS = [
    { name: "Sipho Dlamini",   subject: "Mathematics · scored 42% on last quiz",       score: 42,  initials: "SD" },
    { name: "Lerato Mokoena",  subject: "Physical Sciences · missed 3 lessons",         score: 51,  initials: "LM" },
    { name: "Amahle Zulu",     subject: "Life Sciences · below 60% for 2 weeks",        score: 55,  initials: "AZ" },
    { name: "Tebogo Nkosi",    subject: "Mathematics · struggling with equations",       score: 48,  initials: "TN" },
];

const RECENT_ACTIVITY = [
    { icon: AlertOutlined, title: "Intervention created for Sipho Dlamini",    time: "Today, 10:14 AM",      tag: "Maths" },
    { icon: BookOutlined,  title: "Assigned Algebra module to Grade 10A",       time: "Today, 9:00 AM",       tag: null },
    { icon: UserOutlined,  title: "Lerato Mokoena completed Physics quiz",      time: "Yesterday, 3:45 PM",   tag: "Physics" },
    { icon: BarChartOutlined, title: "Weekly progress report generated",        time: "Yesterday, 8:00 AM",   tag: null },
];

function scoreColor(score: number) {
    if (score >= 65) return "#00b8a9";
    if (score >= 50) return "#fa8c16";
    return "#ff4d4f";
}

export default function TutorDashboardPage() {
    const { styles } = useStyles();

    return (
        <div>
            {/* Page header */}
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} style={{ marginBottom: 0 }}>
                        Tutor Dashboard
                    </Title>
                    <Text type="secondary">Welcome back. Here&apos;s an overview of your class.</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />}>
                    New Intervention
                </Button>
            </div>

            {/* Stat cards */}
            <Row gutter={[16, 16]} className={styles.statsRow}>
                {STATS.map(({ icon: Icon, value, label, badge, type }) => (
                    <Col key={label} xs={24} sm={12} lg={6}>
                        <Card className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <Icon className={styles.statIcon} />
                                {badge && type === "trend" && (
                                    <span className={styles.trendBadge}>
                                        <RiseOutlined /> {badge}
                                    </span>
                                )}
                                {badge && type === "warning" && (
                                    <span className={styles.warningBadge}>{badge}</span>
                                )}
                            </div>
                            <div className={styles.statValue}>{value}</div>
                            <div className={styles.statLabel}>{label}</div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                {/* Left column */}
                <Col xs={24} lg={14}>
                    {/* Class performance */}
                    <Card
                        title="Class Performance by Subject"
                        className={styles.sectionCard}
                        style={{ marginBottom: 16 }}
                    >
                        {CLASS_PERFORMANCE.map(({ subject, percent }) => (
                            <div key={subject} className={styles.subjectRow}>
                                <div className={styles.subjectHeader}>
                                    <span>{subject}</span>
                                    <span
                                        className={styles.subjectPercent}
                                        style={{ color: scoreColor(percent) }}
                                    >
                                        {percent}%
                                    </span>
                                </div>
                                <Progress
                                    percent={percent}
                                    showInfo={false}
                                    strokeColor={scoreColor(percent)}
                                />
                            </div>
                        ))}
                    </Card>

                    {/* Recent activity */}
                    <Card title="Recent Activity" className={styles.sectionCard}>
                        {RECENT_ACTIVITY.map(({ icon: Icon, title, time, tag }) => (
                            <div key={title} className={styles.activityItem}>
                                <div className={styles.activityIcon}>
                                    <Icon />
                                </div>
                                <div className={styles.activityInfo}>
                                    <span className={styles.activityTitle}>{title}</span>
                                    <span className={styles.activityTime}>{time}</span>
                                </div>
                                {tag && <Tag color="cyan">{tag}</Tag>}
                            </div>
                        ))}
                    </Card>
                </Col>

                {/* Right column */}
                <Col xs={24} lg={10}>
                    {/* Quick actions */}
                    <Card
                        title="Quick Actions"
                        className={styles.sectionCard}
                        style={{ marginBottom: 16 }}
                    >
                        <div className={styles.quickActionsGrid}>
                            <Button
                                className={styles.quickActionBtn}
                                icon={<AlertOutlined />}
                            >
                                Create Intervention
                            </Button>
                            <Button
                                className={styles.quickActionBtn}
                                icon={<BookOutlined />}
                            >
                                Assign Module
                            </Button>
                            <Button
                                className={styles.quickActionBtn}
                                icon={<BarChartOutlined />}
                            >
                                View Analytics
                            </Button>
                            <Button
                                className={styles.quickActionBtn}
                                icon={<BulbOutlined />}
                            >
                                Manage Students
                            </Button>
                        </div>
                    </Card>

                    {/* At-risk students */}
                    <Card
                        title="Students At Risk"
                        className={styles.sectionCard}
                        extra={<Tag color="red">{AT_RISK_STUDENTS.length} flagged</Tag>}
                    >
                        {AT_RISK_STUDENTS.map(({ name, subject, score, initials }) => (
                            <div key={name} className={styles.riskItem}>
                                <Avatar size="small">{initials}</Avatar>
                                <div className={styles.riskInfo}>
                                    <span className={styles.riskName}>{name}</span>
                                    <span className={styles.riskSubject}>{subject}</span>
                                </div>
                                <span
                                    className={styles.riskScore}
                                    style={{ color: scoreColor(score) }}
                                >
                                    {score}%
                                </span>
                            </div>
                        ))}
                        <Button type="link" className={styles.viewAllLink}>
                            View All Students →
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
