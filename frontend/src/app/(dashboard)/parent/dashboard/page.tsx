"use client";

import {
    BookOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    RiseOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Progress,
    Row,
    Tabs,
    Tag,
    Typography,
    message,
} from "antd";
import { useState } from "react";
import { linkChild, registerChild } from "@/services/parent/parentService";
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
    const [modalOpen, setModalOpen]   = useState(false);
    const [activeTab, setActiveTab]   = useState("link");
    const [submitting, setSubmitting] = useState(false);
    const [linkForm]     = Form.useForm();
    const [registerForm] = Form.useForm();

    const handleLink = async () => {
        let values;
        try {
            values = await linkForm.validateFields();
        } catch {
            return; // validation errors shown inline
        }
        setSubmitting(true);
        try {
            const result = await linkChild({ usernameOrEmail: values.usernameOrEmail });
            message.success(`${result.studentName} (${result.gradeLevel}) linked successfully.`);
            linkForm.resetFields();
            setModalOpen(false);
        } catch (err: unknown) {
            message.error(err instanceof Error ? err.message : "Failed to link child.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegister = async () => {
        let values;
        try {
            values = await registerForm.validateFields();
        } catch {
            return; // validation errors shown inline
        }
        setSubmitting(true);
        try {
            const result = await registerChild({
                name:         values.name,
                surname:      values.surname,
                emailAddress: values.emailAddress,
                userName:     values.userName,
                password:     values.password,
                gradeLevel:   values.gradeLevel,
            });
            message.success(`Account for ${result.studentName} created and linked.`);
            registerForm.resetFields();
            setModalOpen(false);
        } catch (err: unknown) {
            message.error(err instanceof Error ? err.message : "Failed to register child.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            {/* Page header */}
            <div className={styles.pageHeader}>
                <div>
                    <Typography.Title level={2} style={{ marginBottom: 0 }}>Parent Dashboard</Typography.Title>
                    <Text type="secondary">Monitoring progress for Thabo Mokoena</Text>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.childBadge}>
                        <Avatar className={styles.childAvatar}>{CHILD.initials}</Avatar>
                        <Text className={styles.childName}>{CHILD.name} (Grade {CHILD.grade})</Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalOpen(true)}
                        className={styles.addChildBtn}
                    >
                        Add Child
                    </Button>
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

            {/* Add / Link Child modal */}
            <Modal
                title="Add Child"
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    linkForm.resetFields();
                    registerForm.resetFields();
                }}
                footer={null}
                width={480}
                destroyOnClose
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: "link",
                            label: "Link Existing Account",
                            children: (
                                <Form form={linkForm} layout="vertical" style={{ paddingTop: 8 }}>
                                    <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                                        Enter the username or email address of your child&apos;s existing student account.
                                    </Text>
                                    <Form.Item
                                        name="usernameOrEmail"
                                        label="Username or Email"
                                        rules={[{ required: true, message: "Please enter the student username or email." }]}
                                    >
                                        <Input placeholder="e.g. thabo.mokoena or thabo@school.com" />
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button
                                            type="primary"
                                            block
                                            loading={submitting}
                                            onClick={handleLink}
                                            style={{ background: "#00b8a9", borderColor: "#00b8a9" }}
                                        >
                                            Link Child
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                        {
                            key: "register",
                            label: "Register New Child",
                            children: (
                                <Form form={registerForm} layout="vertical" style={{ paddingTop: 8 }}>
                                    <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                                        Create a new student account on your child&apos;s behalf.
                                    </Text>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="name"
                                                label="First Name"
                                                rules={[{ required: true, message: "Required" }]}
                                            >
                                                <Input placeholder="Thabo" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="surname"
                                                label="Surname"
                                                rules={[{ required: true, message: "Required" }]}
                                            >
                                                <Input placeholder="Mokoena" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item
                                        name="emailAddress"
                                        label="Email Address"
                                        rules={[
                                            { required: true, message: "Required" },
                                            { type: "email", message: "Must be a valid email" },
                                        ]}
                                    >
                                        <Input placeholder="thabo@school.com" />
                                    </Form.Item>
                                    <Form.Item
                                        name="userName"
                                        label="Username"
                                        rules={[{ required: true, message: "Required" }]}
                                    >
                                        <Input placeholder="thabo.mokoena" />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        label="Password"
                                        rules={[
                                            { required: true, message: "Required" },
                                            { min: 8, message: "Minimum 8 characters" },
                                        ]}
                                    >
                                        <Input.Password placeholder="Min. 8 characters" />
                                    </Form.Item>
                                    <Form.Item
                                        name="gradeLevel"
                                        label="Grade Level"
                                        rules={[{ required: true, message: "Required" }]}
                                    >
                                        <Input placeholder="e.g. Grade 10" />
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button
                                            type="primary"
                                            block
                                            loading={submitting}
                                            onClick={handleRegister}
                                            style={{ background: "#00b8a9", borderColor: "#00b8a9" }}
                                        >
                                            Register &amp; Link Child
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                    ]}
                />
            </Modal>
        </div>
    );
}
