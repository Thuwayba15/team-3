"use client";

import { ApiOutlined, GlobalOutlined, LineChartOutlined, TeamOutlined } from "@ant-design/icons";
import { Card, Col, Progress, Row, Typography } from "antd";
import { PageHeader } from "@/components/layout";
import { useStyles } from "./styles";

const { Text } = Typography;

const STAT_CARDS = [
    { icon: TeamOutlined, value: "12,450", label: "Total Active Users", trend: "+12% this month" },
    { icon: GlobalOutlined, value: "4",     label: "Language Usage" },
    { icon: ApiOutlined,    value: "45.2k", label: "AI API Calls (Today)" },
    { icon: LineChartOutlined, value: "99.9%", label: "System Uptime" },
];

const LANGUAGE_STATS = [
    { label: "English",   percent: 55 },
    { label: "IsiZulu",   percent: 25 },
    { label: "Sesotho",   percent: 12 },
    { label: "Afrikaans", percent: 8 },
];

const ROLE_LEGEND = [
    { label: "Students (80%)", color: "#00b8a9" },
    { label: "Tutors (5%)",    color: "#4096ff" },
    { label: "Parents (15%)",  color: "#faad14" },
];

/** Admin dashboard — system overview with key platform metrics. */
export default function AdminDashboardPage() {
    const { styles } = useStyles();

    return (
        <div>
            <PageHeader title="System Administration" subtitle="Platform overview and system health" />

            <Row gutter={[16, 16]} className={styles.statsRow}>
                {STAT_CARDS.map(({ icon: Icon, value, label, trend }) => (
                    <Col key={label} xs={24} sm={12} lg={6}>
                        <Card className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <Icon className={styles.statIcon} />
                                {trend && <span className={styles.trendBadge}>↗ {trend}</span>}
                            </div>
                            <div className={styles.statValue}>{value}</div>
                            <div className={styles.statLabel}>{label}</div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card title="User Distribution by Role" className={styles.chartCard}>
                        <div className={styles.piePlaceholder}>
                            <Text type="secondary">Pie Chart Visualization Placeholder</Text>
                        </div>
                        <div className={styles.legend}>
                            {ROLE_LEGEND.map(({ label, color }) => (
                                <span key={label} className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ background: color }} />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card title="Language Preference Analytics" className={styles.chartCard}>
                        <div className={styles.progressList}>
                            {LANGUAGE_STATS.map(({ label, percent }) => (
                                <div key={label} className={styles.progressItem}>
                                    <div className={styles.progressHeader}>
                                        <span>{label}</span>
                                        <span>{percent}%</span>
                                    </div>
                                    <Progress percent={percent} showInfo={false} strokeColor="#00b8a9" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
