"use client";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ISubject } from "@/providers/subject";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

interface ISubjectsPanelProps {
    subjects?: ISubject[];
    isLoading: boolean;
    selectedSubjectId: string;
    onSelectSubject: (id: string) => void;
    onEditSubject: (subject: ISubject) => void;
    onDeleteSubject: (subjectId: string) => void;
}

export function SubjectsPanel({
    subjects,
    isLoading,
    selectedSubjectId,
    onSelectSubject,
    onEditSubject,
    onDeleteSubject,
}: ISubjectsPanelProps) {
    const { styles } = useStyles();

    const columns: ColumnsType<ISubject> = [
        {
            title: "Subject",
            dataIndex: "name",
            key: "name",
            render: (value: string, record: ISubject) => (
                <div className={styles.subjectNameCell}>
                    <Text className={styles.subjectName}>{value}</Text>
                    <Text className={styles.subjectCode}>{record.gradeLevel}</Text>
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 130,
            render: (_: unknown, record: ISubject) => (
                <Space size={8}>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        className={styles.iconAction}
                        onClick={(e) => { e.stopPropagation(); onEditSubject(record); }}
                    />
                    <Popconfirm
                        title="Delete subject?"
                        description="This also removes generated drafts for the subject."
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={(e) => { e?.stopPropagation(); onDeleteSubject(record.id); }}
                        onCancel={(e) => e?.stopPropagation()}
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className={styles.deleteAction}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card className={styles.panelCard}>
            <div className={styles.panelHeader}>
                <div>
                    <Title level={4} className={styles.panelTitle}>Subjects</Title>
                    <Text className={styles.panelSubtitle}>Create, edit, and manage available subjects.</Text>
                </div>
            </div>
            <Spin spinning={isLoading}>
                <Table
                    className={styles.subjectTable}
                    columns={columns}
                    dataSource={subjects ?? []}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    onRow={(record) => ({ onClick: () => onSelectSubject(record.id) })}
                    rowClassName={(record) => (record.id === selectedSubjectId ? styles.selectedSubjectRow : "")}
                />
            </Spin>
        </Card>
    );
}
