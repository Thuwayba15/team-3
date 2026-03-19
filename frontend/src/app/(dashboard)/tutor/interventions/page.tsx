"use client";

import {
    CheckOutlined,
    FileTextOutlined,
    MessageOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Input, Tag, Typography } from "antd";
import { useState } from "react";
import { useStyles } from "./styles";

const { Title, Text } = Typography;

type Severity = "Critical" | "Warning";

interface Intervention {
    key: string;
    name: string;
    initials: string;
    grade: string;
    subject: string;
    description: string;
    severity: Severity;
    alertText: string;
}

const INTERVENTIONS: Intervention[] = [
    {
        key: "1",
        name: "Sipho Ndlovu",
        initials: "SN",
        grade: "Grade 10",
        subject: "Mathematics",
        description: "Failed last 3 quizzes in Algebra",
        severity: "Critical",
        alertText:
            'Student has failed the last 3 quizzes on "Algebraic Fractions" with scores of 35%, 42%, and 38%. AI Tutor logs indicate fundamental misunderstanding of finding common denominators.',
    },
    {
        key: "2",
        name: "Lerato Mokoena",
        initials: "LM",
        grade: "Grade 10",
        subject: "Physical Sciences",
        description: "Inactive for 5 days",
        severity: "Warning",
        alertText:
            "Student has not logged in or engaged with any learning material for 5 consecutive days. Last session ended abruptly mid-lesson on Newton's Laws.",
    },
];

const SEVERITY_TAG: Record<Severity, { color: string; label: string }> = {
    Critical: { color: "error",   label: "Critical" },
    Warning:  { color: "warning", label: "Warning"  },
};

const SEVERITY_DETAIL_TAG: Record<Severity, string> = {
    Critical: "Critical Intervention",
    Warning:  "Warning",
};

export default function TutorInterventionsPage() {
    const { styles } = useStyles();
    const [selectedKey, setSelectedKey] = useState(INTERVENTIONS[0].key);
    const [notes, setNotes] = useState<Record<string, string>>({});

    const selected = INTERVENTIONS.find((i) => i.key === selectedKey)!;

    return (
        <div>
            <div className={styles.pageHeader}>
                <Title level={2} style={{ marginBottom: 0 }}>
                    Intervention Management
                </Title>
                <Text type="secondary">
                    Manage students requiring additional support
                </Text>
            </div>

            <div className={styles.layout}>
                {/* Left — action required list */}
                <Card
                    title="Action Required"
                    className={styles.listCard}
                    size="small"
                >
                    {INTERVENTIONS.map((item) => (
                        <div
                            key={item.key}
                            className={`${styles.studentRow} ${
                                item.key === selectedKey
                                    ? styles.studentRowSelected
                                    : ""
                            }`}
                            onClick={() => setSelectedKey(item.key)}
                        >
                            <div className={styles.studentRowHeader}>
                                <span className={styles.studentRowName}>
                                    {item.name}
                                </span>
                                <Tag color={SEVERITY_TAG[item.severity].color}>
                                    {SEVERITY_TAG[item.severity].label}
                                </Tag>
                            </div>
                            <span className={styles.studentRowDesc}>
                                {item.description}
                            </span>
                        </div>
                    ))}
                </Card>

                {/* Right — detail view */}
                <Card className={styles.detailCard}>
                    {/* Header */}
                    <div className={styles.detailHeader}>
                        <div className={styles.detailHeaderLeft}>
                            <Avatar size={48}>{selected.initials}</Avatar>
                            <div>
                                <div className={styles.detailName}>
                                    {selected.name}
                                </div>
                                <div className={styles.detailMeta}>
                                    {selected.grade} • {selected.subject}
                                </div>
                            </div>
                        </div>
                        <Tag color={SEVERITY_TAG[selected.severity].color}>
                            {SEVERITY_DETAIL_TAG[selected.severity]}
                        </Tag>
                    </div>

                    {/* Reason for alert */}
                    <div className={styles.sectionLabel}>Reason for Alert</div>
                    <div className={styles.alertBox}>
                        <WarningOutlined className={styles.alertIcon} />
                        <span>{selected.alertText}</span>
                    </div>

                    {/* Recommended actions */}
                    <div className={styles.sectionLabel}>
                        Recommended Actions
                    </div>
                    <div className={styles.actionsGrid}>
                        <div
                            className={`${styles.actionCard} ${styles.actionCardPrimary}`}
                        >
                            <MessageOutlined className={styles.actionIcon} />
                            <div>
                                <span className={styles.actionTitle}>
                                    Message Student
                                </span>
                                <span className={styles.actionDesc}>
                                    Send an encouraging message
                                </span>
                            </div>
                        </div>
                        <div className={styles.actionCard}>
                            <FileTextOutlined className={styles.actionIcon} />
                            <div>
                                <span className={styles.actionTitle}>
                                    Assign Remedial Module
                                </span>
                                <span className={styles.actionDesc}>
                                    Basic fractions review
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Teacher notes */}
                    <div className={styles.notesSection}>
                        <div className={styles.sectionLabel}>Teacher Notes</div>
                        <Input.TextArea
                            rows={4}
                            placeholder="Add notes about this intervention..."
                            value={notes[selected.key] ?? ""}
                            onChange={(e) =>
                                setNotes((prev) => ({
                                    ...prev,
                                    [selected.key]: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                        >
                            Mark as Addressed
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
