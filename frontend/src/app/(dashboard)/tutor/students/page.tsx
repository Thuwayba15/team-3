"use client";

import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Progress, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import Table from "antd/es/table";
import { useMemo, useState } from "react";
import { useStyles } from "./styles";

const { Title, Text } = Typography;

type Status = "On Track" | "Monitor" | "At Risk";

interface Student {
    key: string;
    name: string;
    progress: number;
    weakestTopic: string;
    lastActive: string;
    status: Status;
}

const STUDENTS: Student[] = [
    { key: "1", name: "Amina Patel",      progress: 85, weakestTopic: "None",                lastActive: "Today",       status: "On Track" },
    { key: "2", name: "Bongani Khumalo",  progress: 62, weakestTopic: "Exponents",            lastActive: "Yesterday",   status: "Monitor"  },
    { key: "3", name: "Lerato Mokoena",   progress: 45, weakestTopic: "Algebraic Fractions",  lastActive: "5 days ago",  status: "At Risk"  },
    { key: "4", name: "Sipho Ndlovu",     progress: 38, weakestTopic: "Factorisation",         lastActive: "Today",       status: "At Risk"  },
    { key: "5", name: "Thabo M.",         progress: 78, weakestTopic: "Negative Exponents",   lastActive: "Today",       status: "On Track" },
];

const STATUS_CONFIG: Record<Status, { color: string; strokeColor: string }> = {
    "On Track": { color: "success",  strokeColor: "#00b8a9" },
    "Monitor":  { color: "warning",  strokeColor: "#fa8c16" },
    "At Risk":  { color: "error",    strokeColor: "#ff4d4f" },
};

export default function TutorStudentsPage() {
    const { styles } = useStyles();
    const [search, setSearch] = useState("");

    const filtered = useMemo(
        () =>
            STUDENTS.filter((s) =>
                s.name.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const columns: ColumnsType<Student> = [
        {
            title: "Student Name",
            dataIndex: "name",
            key: "name",
            render: (name: string) => (
                <span className={styles.studentName}>{name}</span>
            ),
        },
        {
            title: "Overall Progress",
            dataIndex: "progress",
            key: "progress",
            render: (progress: number, record: Student) => (
                <div className={styles.progressCell}>
                    <span className={styles.progressPercent}>{progress} %</span>
                    <Progress
                        percent={progress}
                        showInfo={false}
                        strokeColor={STATUS_CONFIG[record.status].strokeColor}
                        size="small"
                    />
                </div>
            ),
        },
        {
            title: "Weakest Topic",
            dataIndex: "weakestTopic",
            key: "weakestTopic",
        },
        {
            title: "Last Active",
            dataIndex: "lastActive",
            key: "lastActive",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: Status) => (
                <Tag color={STATUS_CONFIG[status].color}>{status}</Tag>
            ),
        },
    ];

    return (
        <div>
            <div className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <Title level={2} style={{ marginBottom: 0 }}>
                        Student Monitoring
                    </Title>
                    <Text type="secondary">
                        Track individual student progress and analytics
                    </Text>
                </div>
                <div className={styles.headerControls}>
                    <Input
                        className={styles.searchInput}
                        placeholder="Search students..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FilterOutlined />}>Filter</Button>
                </div>
            </div>

            <Card className={styles.tableCard}>
                <Table
                    columns={columns}
                    dataSource={filtered}
                    pagination={false}
                    rowKey="key"
                />
            </Card>
        </div>
    );
}
