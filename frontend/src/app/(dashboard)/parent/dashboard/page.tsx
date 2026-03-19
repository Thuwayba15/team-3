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
    Tooltip,
    Typography,
    message,
} from "antd";
import { useEffect, useState } from "react";
import {
    type ChildSummary,
    getMyChildren,
    linkChild,
    registerChild,
} from "@/services/parent/parentService";
import { useStyles } from "./styles";

const { Text } = Typography;

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
        description: "Scored below 60% on the last two quizzes regarding Cell Structure. The AI Tutor has recommended a review module.",
    },
];

const ACTIVITY = [
    { title: "Completed Math Quiz",   time: "Today, 2:30 PM",     score: "85%", tag: null },
    { title: "Chatted with AI Tutor", time: "Yesterday, 4:15 PM", score: null,  tag: "Physics" },
];

export default function ParentDashboardPage() {
    const { styles } = useStyles();

    // ── Children list & selected child ──────────────────────────────────────
    const [children,      setChildren]      = useState<ChildSummary[]>([]);
    const [selectedChild, setSelectedChild] = useState<ChildSummary | null>(null);
    const [loadingChildren, setLoadingChildren] = useState(true);

    useEffect(() => {
        getMyChildren()
            .then((list) => {
                setChildren(list);
                if (list.length > 0) setSelectedChild(list[0]);
            })
            .catch(() => {
                // Fallback: no children linked yet — show empty state
            })
            .finally(() => setLoadingChildren(false));
    }, []);

    // ── Add-child modal ──────────────────────────────────────────────────────
    const [modalOpen,   setModalOpen]   = useState(false);
    const [activeTab,   setActiveTab]   = useState("link");
    const [submitting,  setSubmitting]  = useState(false);
    const [linkForm]     = Form.useForm();
    const [registerForm] = Form.useForm();

    const closeModal = () => {
        setModalOpen(false);
        linkForm.resetFields();
        registerForm.resetFields();
    };

    const handleLink = async () => {
        let values;
        try { values = await linkForm.validateFields(); }
        catch { return; }

        setSubmitting(true);
        try {
            const result = await linkChild({ usernameOrEmail: values.usernameOrEmail });
            message.success(`${result.studentName} (${result.gradeLevel}) linked successfully.`);
            setChildren((prev) => [...prev, result]);
            if (!selectedChild) setSelectedChild(result);
            closeModal();
        } catch (err: unknown) {
            message.error(err instanceof Error ? err.message : "Failed to link child.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegister = async () => {
        let values;
        try { values = await registerForm.validateFields(); }
        catch { return; }

        setSubmitting(true);
        try {
            const result = await registerChild({
                name:         values.name,
                surname:      values.surname,
                emailAddress: values.emailAddress,
                userName:     values.userName,
                password:     values.password,
            });
            message.success(`Account for ${result.studentName} created and linked.`);
            setChildren((prev) => [...prev, result]);
            if (!selectedChild) setSelectedChild(result);
            closeModal();
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
                    <Text type="secondary">
                        {selectedChild
                            ? `Monitoring progress for ${selectedChild.studentName}`
                            : "No student linked yet"}
                    </Text>
                </div>

                <div className={styles.headerRight}>
                    {/* Student switcher — avatar pills */}
                    {!loadingChildren && children.length > 0 && (
                        <div className={styles.childSwitcher}>
                            {children.map((child) => (
                                <Tooltip key={child.studentUserId} title={`${child.studentName} · ${child.gradeLevel}`}>
                                    <button
                                        className={`${styles.childPill} ${
                                            selectedChild?.studentUserId === child.studentUserId
                                                ? styles.childPillActive
                                                : ""
                                        }`}
                                        onClick={() => setSelectedChild(child)}
                                    >
                                        <Avatar
                                            size="small"
                                            className={
                                                selectedChild?.studentUserId === child.studentUserId
                                                    ? styles.childAvatarActive
                                                    : styles.childAvatar
                                            }
                                        >
                                            {child.initials}
                                        </Avatar>
                                        <span className={styles.childPillName}>{child.studentName.split(" ")[0]}</span>
                                    </button>
                                </Tooltip>
                            ))}
                        </div>
                    )}

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
                                <Progress percent={percent} showInfo={false} strokeColor="#00b8a9" />
                            </div>
                        ))}
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
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
                onCancel={closeModal}
                footer={null}
                width="min(480px, calc(100vw - 32px))"
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
                                            className={styles.addChildBtn}
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
                                        <Col xs={24} sm={12}>
                                            <Form.Item name="name" label="First Name" rules={[{ required: true, message: "Required" }]}>
                                                <Input placeholder="Thabo" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Form.Item name="surname" label="Surname" rules={[{ required: true, message: "Required" }]}>
                                                <Input placeholder="Mokoena" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item
                                        name="emailAddress"
                                        label="Email Address"
                                        rules={[{ required: true, message: "Required" }, { type: "email", message: "Must be a valid email" }]}
                                    >
                                        <Input placeholder="thabo@school.com" />
                                    </Form.Item>
                                    <Form.Item name="userName" label="Username" rules={[{ required: true, message: "Required" }]}>
                                        <Input placeholder="thabo.mokoena" />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        label="Password"
                                        rules={[{ required: true, message: "Required" }, { min: 8, message: "Minimum 8 characters" }]}
                                    >
                                        <Input.Password placeholder="Min. 8 characters" />
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button
                                            type="primary"
                                            block
                                            loading={submitting}
                                            onClick={handleRegister}
                                            className={styles.addChildBtn}
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
