"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { PageHeader } from "@/components/layout";
import { useStyles } from "./styles";

type UserRole = "Student" | "Tutor" | "Parent" | "Admin";
type UserStatus = "Active" | "Inactive";

interface IUser {
    key: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    dateJoined: string;
}

const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
    Student: { bg: "#e6fffb", text: "#00b8a9" },
    Tutor:   { bg: "#e6fffb", text: "#00b8a9" },
    Parent:  { bg: "#fffbe6", text: "#d48806" },
    Admin:   { bg: "#f5f5f5", text: "#595959" },
};

const MOCK_USERS: IUser[] = [
    { key: "1", name: "Amina Patel",     email: "amina@school.za",        role: "Student", status: "Active",   dateJoined: "2024-01-15" },
    { key: "2", name: "Bongani Khumalo", email: "bongani@school.za",      role: "Student", status: "Active",   dateJoined: "2024-02-01" },
    { key: "3", name: "Ms. Nkosi",       email: "nkosi@school.za",        role: "Tutor",   status: "Active",   dateJoined: "2023-08-10" },
    { key: "4", name: "Mrs. Mokoena",    email: "mokoena@parent.za",      role: "Parent",  status: "Active",   dateJoined: "2024-03-05" },
    { key: "5", name: "Zanele Dlamini",  email: "zanele@school.za",       role: "Student", status: "Inactive", dateJoined: "2024-01-20" },
    { key: "6", name: "Admin User",      email: "admin@ubuntulearn.za",   role: "Admin",   status: "Active",   dateJoined: "2023-01-01" },
];

const ROLE_OPTIONS = [
    { label: "All Roles", value: "" },
    { label: "Student",   value: "Student" },
    { label: "Tutor",     value: "Tutor" },
    { label: "Parent",    value: "Parent" },
    { label: "Admin",     value: "Admin" },
];

const STATUS_OPTIONS = [
    { label: "All Status", value: "" },
    { label: "Active",     value: "Active" },
    { label: "Inactive",   value: "Inactive" },
];

/** Admin user management page — lists platform users with role and status filters. */
export default function AdminUsersPage() {
    const { styles } = useStyles();
    const [search, setSearch]       = useState("");
    const [roleFilter, setRoleFilter]     = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filtered = MOCK_USERS.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole   = roleFilter   ? user.role === roleFilter     : true;
        const matchesStatus = statusFilter ? user.status === statusFilter : true;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const columns: ColumnsType<IUser> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (value: string) => <strong>{value}</strong>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: UserRole) => {
                const { bg, text } = ROLE_COLORS[role];
                return (
                    <Tag className={styles.roleTag} style={{ background: bg, color: text }}>
                        {role}
                    </Tag>
                );
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: UserStatus) => (
                <Tag
                    className={styles.statusTag}
                    color={status === "Active" ? "success" : "warning"}
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: "Date Joined",
            dataIndex: "dateJoined",
            key: "dateJoined",
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

            <Table
                className={styles.table}
                columns={columns}
                dataSource={filtered}
                pagination={false}
                bordered={false}
            />
        </div>
    );
}
