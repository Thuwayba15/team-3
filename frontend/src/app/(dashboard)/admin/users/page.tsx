"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Select, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { userService, type IUser } from "@/services/users/userService";
import { useStyles } from "./styles";

type RoleTagClass = "roleTagAdmin" | "roleTagTutor" | "roleTagParent" | "roleTagStudent";

const ROLE_CLASS_BY_NAME: Record<string, RoleTagClass> = {
    ADMIN: "roleTagAdmin",
    TUTOR: "roleTagTutor",
    PARENT: "roleTagParent",
    STUDENT: "roleTagStudent",
};

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
                    return <Tag className={`${styles.roleTag} ${styles.roleTagDefault}`}>—</Tag>;
                }
                return roleNames.map((role) => {
                    const roleClassName = ROLE_CLASS_BY_NAME[role] ?? "roleTagDefault";
                    return (
                        <Tag key={role} className={`${styles.roleTag} ${styles[roleClassName]}`}>
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

            {error && <Alert type="error" message={error} className={styles.errorAlert} />}

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
                        className={styles.filterSelect}
                        options={ROLE_OPTIONS}
                        value={roleFilter}
                        onChange={setRoleFilter}
                    />
                    <Select
                        className={styles.filterSelect}
                        options={STATUS_OPTIONS}
                        value={statusFilter}
                        onChange={setStatusFilter}
                    />
                </div>
                <div className={styles.addButtonWrapper}>
                    <Button type="primary" icon={<PlusOutlined />} className={styles.addButton}>
                        Add User
                    </Button>
                </div>
            </div>

            <Spin spinning={loading}>
                <Table
                    className={styles.table}
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={false}
                    bordered={false}
                    scroll={{ x: "max-content" }}
                />
            </Spin>
        </div>
    );
}
