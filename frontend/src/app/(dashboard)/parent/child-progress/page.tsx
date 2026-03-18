"use client";

import {
    BookOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    RobotOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, Progress, Row, Tag, Typography } from "antd";
import { useStyles } from "./styles";

const { Text } = Typography;

const CHILD = { name: "Thabo Mokoena", grade: 10, school: "Ubuntu High School", initials: "TM" };

const SUBJECTS = [
    {
        name: "Mathematics",
        percent: 82,
        topics: [
            { name: "Algebraic Expressions", percent: 95 },
            { name: "Exponents", percent: 75 },
            { name: "Number Patterns", percent: 65 },
        ],
    },
    {
        name: "Physical Sciences",
        percent: 75,
        topics: [
            { name: "Mechanics", percent: 80 },
            { name: "Waves & Sound", percent: 70 },
            { name: "Electricity", percent: 75 },
        ],
    },
    {
        name: "Life Sciences",
        percent: 60,
        topics: [
            { name: "Cell Structure", percent: 55 },
            { name: "Plant Tissues", percent: 65 },
            { name: "Human Skeleton", percent: 60 },
        ],
    },
    {
        name: "English",
        percent: 88,
        topics: [
            { name: "Comprehension", percent: 97 },
            { name: "Language Structures", percent: 82 },
            { name: "Literature", percent: 80 },
        ],
    },
];

const MASTERY_TOPICS = [
    { name: "Algebraic Expr", percent: 90 },
    { name: "Literature",     percent: 85 },
    { name: "Exponents",      percent: 75 },
    { name: "Science",        percent: 60 },
    { name: "Cell Structure", percent: 55 },
    { name: "Comprehension",  percent: 92 },
    { name: "Relevance",      percent: 80 },
    { name: "Atoms",          percent: 70 },
];

const ASSESSMENTS = [
    { subject: "Mathematics Quiz",      topic: "Exponents",       when: "7 days ago",  score: 89 },
    { subject: "Life Sciences Test",    topic: "Cell Structure",  when: "Yesterday",   score: 55 },
    { subject: "English Assignment",    topic: "Comprehension",   when: "2 days ago",  score: 90 },
    { subject: "Physical Sciences Quiz",topic: "Mechanics",       when: "Last week",   score: 88 },
];

const ACTIVITY = [
    { icon: "book",  label: "Completed Quiz: Exponents",          when: "Today, 2:30 PM",       color: "#00b8a9" },
    { icon: "robot", label: "Used AI Tutor for Life Sciences",    when: "Yesterday, 4:15 PM",   color: "#fa8c16" },
    { icon: "alert", label: "Started Lesson: Cell Structure",     when: "Yesterday, 2:00 PM",   color: "#fa8c16" },
    { icon: "check", label: "Completed Module: Algebraic Expressions", when: "3 days ago",      color: "#00b8a9" },
];

function masteryColor(percent: number): string {
    if (percent >= 80) return "#00b8a9";
    if (percent >= 65) return "#52c41a";
    return "#fadb14";
}

function scoreColor(score: number): string {
    return score >= 65 ? "#52c41a" : "#fa8c16";
}

function ActivityIcon({ type, color }: { type: string; color: string }) {
    const style = { fontSize: 16, color };
    if (type === "book")  return <BookOutlined style={style} />;
    if (type === "robot") return <RobotOutlined style={style} />;
    if (type === "check") return <CheckCircleOutlined style={style} />;
    return <ExclamationCircleOutlined style={style} />;
}

export default function ParentChildProgressPage() {
    const { styles } = useStyles();

    return (
        <div>
            {/* Page header */}
            <div className={styles.pageHeader}>
                <div>
                    <Typography.Title level={2} style={{ marginBottom: 0 }}>Child Progress Details</Typography.Title>
                    <Text type="secondary">Detailed academic overview for Thabo Mokoena</Text>
                </div>
            </div>

            {/* Child profile */}
            <Card className={styles.profileCard}>
                <div className={styles.profileInner}>
                    <Avatar className={styles.profileAvatar} size={48}>{CHILD.initials}</Avatar>
                    <div>
                        <div className={styles.profileName}>{CHILD.name}</div>
                        <Text type="secondary">Grade {CHILD.grade} &nbsp;•&nbsp; {CHILD.school}</Text>
                    </div>
                </div>
            </Card>

            {/* Subject cards */}
            <Row gutter={[16, 16]} className={styles.subjectsRow}>
                {SUBJECTS.map(({ name, percent, topics }) => (
                    <Col key={name} xs={24} md={12}>
                        <Card className={styles.subjectCard}>
                            <div className={styles.subjectCardHeader}>
                                <span className={styles.subjectCardName}>{name}</span>
                                <span
                                    className={styles.subjectCardPercent}
                                    style={{ color: percent < 65 ? "#fa8c16" : "#00b8a9" }}
                                >
                                    {percent}%
                                </span>
                            </div>
                            <Progress
                                percent={percent}
                                showInfo={false}
                                strokeColor={percent < 65 ? "#fa8c16" : "#00b8a9"}
                                className={styles.subjectProgress}
                            />
                            {topics.map(({ name: tName, percent: tPct }) => (
                                <div key={tName} className={styles.topicRow}>
                                    <span>{tName}</span>
                                    <span style={{ color: tPct < 65 ? "#fa8c16" : "#00b8a9", fontWeight: 600 }}>
                                        {tPct}%
                                    </span>
                                </div>
                            ))}
                            <Button type="link" className={styles.viewDetails}>View Details</Button>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Topic Mastery Overview */}
            <Card className={styles.masteryCard} title={
                <div>
                    <div style={{ fontWeight: 600 }}>Topic Mastery Overview</div>
                    <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>
                        Color-coded mastery levels across all subjects
                    </Text>
                </div>
            }>
                <Row gutter={[12, 12]}>
                    {MASTERY_TOPICS.map(({ name, percent }) => (
                        <Col key={name} xs={12} sm={6}>
                            <div
                                className={styles.masteryTile}
                                style={{ background: masteryColor(percent) }}
                            >
                                <div className={styles.masteryPercent}>{percent}%</div>
                                <div className={styles.masteryName}>{name}</div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Card>

            {/* Assessment results + learning activity */}
            <Row gutter={[16, 16]} className={styles.bottomRow}>
                {/* Recent Assessment Results */}
                <Col xs={24} md={12}>
                    <Card title="Recent Assessment Results" className={styles.bottomCard}>
                        {ASSESSMENTS.map(({ subject, topic, when, score }) => (
                            <div key={subject} className={styles.assessmentRow}>
                                <div>
                                    <div className={styles.assessmentSubject}>{subject}</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {topic} • {when}
                                    </Text>
                                </div>
                                <Tag
                                    style={{
                                        background: scoreColor(score) + "22",
                                        color: scoreColor(score),
                                        border: "none",
                                        fontWeight: 700,
                                        fontSize: 13,
                                    }}
                                >
                                    {score}%
                                </Tag>
                            </div>
                        ))}
                    </Card>
                </Col>

                {/* Learning Activity */}
                <Col xs={24} md={12}>
                    <Card title="Learning Activity" className={styles.bottomCard}>
                        {ACTIVITY.map(({ icon, label, when, color }) => (
                            <div key={label} className={styles.activityRow}>
                                <div className={styles.activityIconWrap} style={{ background: color + "22" }}>
                                    <ActivityIcon type={icon} color={color} />
                                </div>
                                <div>
                                    <div className={styles.activityLabel}>{label}</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{when}</Text>
                                </div>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
 

//How do I ma