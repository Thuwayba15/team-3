"use client";

import {
    BookOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    PlayCircleOutlined,
    ReadOutlined,
    RiseOutlined,
    RobotOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import {
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
    {
        icon: TrophyOutlined,
        value: "78%",
        label: "Overall Progress Score",
        badge: "5% this week",
    },
    {
        icon: CheckCircleOutlined,
        value: "12",
        label: "Topics Mastered",
        badge: "2 new",
    },
    {
        icon: BookOutlined,
        value: "24",
        label: "Lessons Completed",
        badge: null,
    },
];

const QUIZ_RESULTS = [
    { name: "Linear Equations",  date: "Today",       score: 85 },
    { name: "Cell Structure",    date: "Yesterday",   score: 92 },
    { name: "Chemical Bonding",  date: "3 days ago",  score: 65 },
];

const UP_NEXT = [
    { title: "Review Biology Notes",   due: "Due tomorrow" },
    { title: "Complete Physics Quiz",  due: "Due Friday"   },
];

function quizScoreColor(score: number) {
    if (score >= 80) return "#52c41a";
    if (score >= 65) return "#00b8a9";
    return "#fa8c16";
}

export default function StudentDashboardPage() {
    const { styles } = useStyles();

    return (
        <div>
            {/* Welcome section */}
            <div className={styles.welcomeSection}>
                <div>
                    <Title level={2} className={styles.welcomeText}>
                        Welcome back, Thabo! 👋
                    </Title>
                    <Text type="secondary">
                        You&apos;re making great progress. Ready to continue learning?
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<RobotOutlined />}
                    size="large"
                    className={styles.askAiBtn}
                >
                    Ask AI Tutor
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {/* Main content column */}
                <Col xs={24} lg={16}>
                    {/* Stat cards */}
                    <Row gutter={[16, 16]} className={styles.statsRow}>
                        {STATS.map(({ icon: Icon, value, label, badge }) => (
                            <Col key={label} xs={24} md={8}>
                                <Card className={styles.statCard}>
                                    <div className={styles.statHeader}>
                                        <Icon className={styles.statIcon} />
                                        {badge && (
                                            <span className={styles.statBadge}>
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

                    {/* Recommended next lesson */}
                    <Card
                        className={styles.nextLessonCard}
                        title={
                            <div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span>Recommended Next Lesson</span>
                                    <Tag color="cyan">Maths Grade 10</Tag>
                                </div>
                                <div className={styles.nextLessonSubtitle}>
                                    Based on your recent performance in Mathematics
                                </div>
                            </div>
                        }
                    >
                        <div className={styles.nextLessonBody}>
                            <div className={styles.lessonThumbnail}>
                                <ReadOutlined />
                            </div>
                            <div className={styles.lessonInfo}>
                                <Text className={styles.lessonTitle}>
                                    Algebraic Expressions: Factorisation ✓
                                </Text>
                                <Text className={styles.lessonDesc}>
                                    Learn how to factorise quadratic trinomials and difference of two
                                    squares. This builds on your previous lesson on expanding brackets.
                                </Text>
                                <div className={styles.lessonActions}>
                                    <Button
                                        type="primary"
                                        icon={<PlayCircleOutlined />}
                                        className={styles.startBtn}
                                    >
                                        Start Lesson
                                    </Button>
                                    <span className={styles.durationText}>
                                        <ClockCircleOutlined /> 25 mins
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Mastery heatmap */}
                    <Card
                        className={styles.heatmapCard}
                        title={
                            <div>
                                <div>Mastery Heatmap</div>
                                <div className={styles.heatmapSubtitle}>
                                    Your performance across subjects
                                </div>
                            </div>
                        }
                    >
                        <div className={styles.heatmapPlaceholder}>
                            Heatmap Visualization Placeholder
                        </div>
                        <div className={styles.heatmapLegend}>
                            <span>Needs Work</span>
                            <div className={styles.legendDots}>
                                {["#ffd6cc", "#ffd666", "#d4f5a1", "#00b8a9"].map((color) => (
                                    <div
                                        key={color}
                                        style={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: 3,
                                            background: color,
                                        }}
                                    />
                                ))}
                            </div>
                            <span>Mastered</span>
                        </div>
                    </Card>
                </Col>

                {/* Right sidebar */}
                <Col xs={24} lg={8}>
                    {/* Recent quiz results */}
                    <Card className={styles.quizCard} title="Recent Quiz Results">
                        {QUIZ_RESULTS.map(({ name, date, score }) => (
                            <div key={name} className={styles.quizItem}>
                                <div className={styles.quizHeader}>
                                    <span className={styles.quizName}>{name}</span>
                                    <span
                                        className={styles.quizScore}
                                        style={{ color: quizScoreColor(score) }}
                                    >
                                        {score}%
                                    </span>
                                </div>
                                <div className={styles.quizDate}>{date}</div>
                                <Progress
                                    percent={score}
                                    showInfo={false}
                                    strokeColor={quizScoreColor(score)}
                                    size="small"
                                    style={{ marginTop: 6 }}
                                />
                            </div>
                        ))}
                        <Button type="link" className={styles.viewAllLink} style={{ padding: 0, marginTop: 8 }}>
                            View All Results →
                        </Button>
                    </Card>

                    {/* Up next */}
                    <Card className={styles.upNextCard} title="Up Next">
                        {UP_NEXT.map(({ title, due }) => (
                            <div key={title} className={styles.upNextItem}>
                                <CheckCircleOutlined className={styles.upNextIcon} />
                                <div className={styles.upNextInfo}>
                                    <span className={styles.upNextTitle}>{title}</span>
                                    <span className={styles.upNextDue}>{due}</span>
                                </div>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
