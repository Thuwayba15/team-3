"use client";

import type React from "react";
import {
    CheckCircleOutlined,
    LineChartOutlined,
    RiseOutlined,
    RobotOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { Card, Progress, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import Table from "antd/es/table";
import { useStyles } from "./styles";

const { Title, Text } = Typography;

/* ── Stat cards ── */
interface StatCard {
    icon: React.FC<{ className?: string }>;
    value: string;
    label: string;
    badge?: string;
    badgeType?: "trend" | "stable";
}

const STATS: StatCard[] = [
    { icon: LineChartOutlined, value: "68%", label: "Class Average",    badge: "+3% this month", badgeType: "trend"  },
    { icon: TrophyOutlined,    value: "78%", label: "Pass Rate",        badge: "Stable",         badgeType: "stable" },
    { icon: CheckCircleOutlined, value: "82%", label: "Completion Rate" },
    { icon: RobotOutlined,     value: "65%", label: "AI Tutor Usage"    },
];

/* ── Performance by topic ── */
const TOPICS = [
    { label: "Expanding Brackets",  percent: 82 },
    { label: "Factorisation",        percent: 75 },
    { label: "Exponents",            percent: 60 },
    { label: "Number Patterns",      percent: 55 },
    { label: "Algebraic Fractions",  percent: 45 },
];

/* ── Student comparison table ── */
type Trend = "Improving" | "Stable" | "Declining";

interface StudentRow {
    key: string;
    name: string;
    avgScore: string;
    quizzes: number;
    trend: Trend;
    lastActive: string;
}

const STUDENTS: StudentRow[] = [
    { key: "1", name: "Amina Patel",     avgScore: "85%", quizzes: 12, trend: "Improving", lastActive: "Today"      },
    { key: "2", name: "Bongani Khumalo", avgScore: "62%", quizzes: 10, trend: "Stable",    lastActive: "Yesterday"  },
    { key: "3", name: "Lerato Mokoena",  avgScore: "45%", quizzes: 8,  trend: "Declining", lastActive: "5 days ago" },
    { key: "4", name: "Sipho Ndlovu",    avgScore: "38%", quizzes: 11, trend: "Declining", lastActive: "Today"      },
    { key: "5", name: "Thabo M.",        avgScore: "78%", quizzes: 14, trend: "Improving", lastActive: "Today"      },
];

const TREND_COLOR: Record<Trend, string> = {
    Improving: "success",
    Stable:    "default",
    Declining: "error",
};

const COLUMNS: ColumnsType<StudentRow> = [
    { title: "Student Name",       dataIndex: "name",       key: "name"       },
    { title: "Average Score",      dataIndex: "avgScore",   key: "avgScore"   },
    { title: "Quizzes Completed",  dataIndex: "quizzes",    key: "quizzes"    },
    {
        title: "Improvement Trend",
        dataIndex: "trend",
        key: "trend",
        render: (trend: Trend) => (
            <Tag color={TREND_COLOR[trend]}>{trend}</Tag>
        ),
    },
    { title: "Last Active", dataIndex: "lastActive", key: "lastActive" },
];

export default function TutorAnalyticsPage() {
    const { styles } = useStyles();

    return (
        <div>
            {/* Page header */}
            <div className={styles.pageHeader}>
                <Title level={2} style={{ marginBottom: 0 }}>
                    Performance Analytics
                </Title>
                <Text type="secondary">
                    Grade 10 Mathematics class insights
                </Text>
            </div>

            {/* Stat cards */}
            <div className={styles.statsRow}>
                {STATS.map(({ icon: Icon, value, label, badge, badgeType }) => (
                    <Card key={label} className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <Icon className={styles.statIcon} />
                            {badge && badgeType === "trend" && (
                                <span className={styles.trendBadge}>
                                    <RiseOutlined /> {badge}
                                </span>
                            )}
                            {badge && badgeType === "stable" && (
                                <span className={styles.stableBadge}>
                                    ~ {badge}
                                </span>
                            )}
                        </div>
                        <div className={styles.statValue}>{value}</div>
                        <div className={styles.statLabel}>{label}</div>
                    </Card>
                ))}
            </div>

            {/* Class performance trend */}
            <Card
                title="Class Performance Trend"
                className={styles.sectionCard}
            >
                <div className={styles.chartPlaceholder}>
                    Line Chart Visualization Placeholder (Monthly Averages)
                </div>
            </Card>

            {/* Two-column row */}
            <div className={styles.twoCol}>
                {/* Performance by topic */}
                <Card
                    title="Performance by Topic"
                    className={styles.sectionCard}
                    style={{ marginBottom: 0 }}
                >
                    {TOPICS.map(({ label, percent }) => (
                        <div key={label} className={styles.topicRow}>
                            <div className={styles.topicHeader}>
                                <span>{label}</span>
                                <span className={styles.topicPercent}>
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

                {/* Score distribution */}
                <Card
                    title="Score Distribution"
                    className={styles.sectionCard}
                    style={{ marginBottom: 0 }}
                >
                    <div className={styles.histogramPlaceholder}>
                        Histogram Visualization Placeholder
                    </div>
                    <div className={styles.scoreStats}>
                        <div className={styles.scoreStat}>
                            <span className={styles.scoreLabel}>Highest</span>
                            <span
                                className={styles.scoreValue}
                                style={{ color: "#00b8a9" }}
                            >
                                95%
                            </span>
                        </div>
                        <div className={styles.scoreStat}>
                            <span className={styles.scoreLabel}>Median</span>
                            <span className={styles.scoreValue}>70%</span>
                        </div>
                        <div className={styles.scoreStat}>
                            <span className={styles.scoreLabel}>Lowest</span>
                            <span
                                className={styles.scoreValue}
                                style={{ color: "#ff4d4f" }}
                            >
                                22%
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Student performance comparison */}
            <Card
                title="Student Performance Comparison"
                className={styles.tableCard}
            >
                <Table
                    columns={COLUMNS}
                    dataSource={STUDENTS}
                    pagination={false}
                    rowKey="key"
                />
            </Card>
        </div>
    );
}
