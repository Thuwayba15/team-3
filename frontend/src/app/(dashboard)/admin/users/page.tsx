"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Select, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { userService, type IUser } from "@/services/users/userService";
import { useStyles } from "./styles";

type RoleColor = { bg: string; text: string };

const ROLE_COLORS: Record<string, RoleColor> = {
    ADMIN:   { bg: "#f5f5f5", text: "#595959" },
    TUTOR:   { bg: "#e6fffb", text: "#00b8a9" },
    PARENT:  { bg: "#fffbe6", text: "#d48806" },
    STUDENT: { bg: "#e6fffb", text: "#00b8a9" },
};

const DEFAULT_ROLE_COLOR: RoleColor = { bg: "#f0f0f0", text: "#8c8c8c" };

const ROLE_OPTIONS = [
    { label: "All Roles", value: "" },
    { label: "Admin",     value: "ADMIN" },
    { label: "Tutor",     value: "TUTOR" },
    { label: "Parent",    value: "PARENT" },
    { label: "Student",   value: "STUDENT" },
];

const STATUS_OPTIONS = [
    { label: "All Status", value: "" },
    { label: "Active",     value: "active" },
    { label: "Inactive",   value: "inactive" },
];

/** Admin user management page — fetches and displays all platform users. */
export default function AdminUsersPage() {
    const { styles } = useStyles();
    const [users, setUsers]               = useState<IUser[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);
    const [search, setSearch]             = useState("");
    const [roleFilter, setRoleFilter]     = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        userService.getAll()
            .then((data) => setUsers(data.items))
            .catch(() => setError("Failed to load users. Please try again."))
            .finally(() => setLoading(false));
    }, []);

    const filtered = users.filter((user) => {
        const matchesSearch = user.fullName.toLowerCase().includes(search.toLowerCase()) ||
            user.emailAddress.toLowerCase().includes(search.toLowerCase());
        const matchesRole   = roleFilter   ? user.roleNames.includes(roleFilter)                              : true;
        const matchesStatus = statusFilter ? (statusFilter === "active") === user.isActive : true;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const columns: ColumnsType<IUser> = [
        {
            title: "Name",
            dataIndex: "fullName",
            key: "fullName",
            render: (value: string) => <strong>{value}</strong>,
        },
        {
            title: "Email",
            dataIndex: "emailAddress",
            key: "emailAddress",
        },
        {
            title: "Role",
            dataIndex: "roleNames",
            key: "roleNames",
            render: (roleNames: string[]) => {
                if (roleNames.length === 0) {
                    return <Tag className={styles.roleTag} style={{ background: "#f0f0f0", color: "#8c8c8c" }}>—</Tag>;
                }
                return roleNames.map((role) => {
                    const { bg, text } = ROLE_COLORS[role] ?? DEFAULT_ROLE_COLOR;
                    return (
                        <Tag key={role} className={styles.roleTag} style={{ background: bg, color: text }}>
                            {role.charAt(0) + role.slice(1).toLowerCase()}
                        </Tag>
                    );
                });
            },
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => (
                <Tag className={styles.statusTag} color={isActive ? "success" : "warning"}>
                    {isActive ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Date Joined",
            dataIndex: "creationTime",
            key: "creationTime",
            render: (value: string) => new Date(value).toISOString().split("T")[0],
        },
        {
            title: "Actions",
            key: "actions",
            render: () => (
                <div className={styles.actions}>
                    <Button type="link" className={styles.editLink}>Edit</Button>
                    <Button type="link" className={styles.disableLink}>Disable</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <PageHeader title="User Management" subtitle="Manage platform users, roles, and access" />

            {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

            <div className={styles.toolbar}>
                <Input.Search
                    className={styles.search}
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                />
                <div className={styles.filters}>
                    <Select
                        options={ROLE_OPTIONS}
                        value={roleFilter}
                        onChange={setRoleFilter}
                        style={{ width: 130 }}
                    />
                    <Select
                        options={STATUS_OPTIONS}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: 130 }}
                    />
                </div>
                <Button type="primary" icon={<PlusOutlined />} className={styles.addButton}>
                    Add User
                </Button>
            </div>

            <Spin spinning={loading}>
                <Table
                    className={styles.table}
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={false}
                    bordered={false}
                />
            </Spin>
        </div>
    );
}
