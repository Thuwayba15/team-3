"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Select, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

/** Admin user management page — fetches and displays all platform users. */
export default function AdminUsersPage() {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const [users, setUsers]               = useState<IUser[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);
    const [search, setSearch]             = useState("");
    const [roleFilter, setRoleFilter]     = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        userService.getAll()
            .then((data) => setUsers(data.items))
            .catch(() => setError(t("dashboard.admin.users.errorLoadUsers")))
            .finally(() => setLoading(false));
    }, [t]);

    const roleOptions = [
        { label: t("dashboard.admin.users.allRoles"), value: "" },
        { label: t("sidebar.admin"), value: "ADMIN" },
        { label: t("sidebar.tutor"), value: "TUTOR" },
        { label: t("sidebar.parent"), value: "PARENT" },
        { label: t("sidebar.student"), value: "STUDENT" },
    ];

    const statusOptions = [
        { label: t("dashboard.admin.users.allStatus"), value: "" },
        { label: t("dashboard.admin.users.active"), value: "active" },
        { label: t("dashboard.admin.users.inactive"), value: "inactive" },
    ];

    const filtered = users.filter((user) => {
        const matchesSearch = user.fullName.toLowerCase().includes(search.toLowerCase()) ||
            user.emailAddress.toLowerCase().includes(search.toLowerCase());
        const matchesRole   = roleFilter   ? user.roleNames.includes(roleFilter)                              : true;
        const matchesStatus = statusFilter ? (statusFilter === "active") === user.isActive : true;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const columns: ColumnsType<IUser> = [
        {
            title: t("dashboard.admin.users.columns.name"),
            dataIndex: "fullName",
            key: "fullName",
            render: (value: string) => <strong>{value}</strong>,
        },
        {
            title: t("dashboard.admin.users.columns.email"),
            dataIndex: "emailAddress",
            key: "emailAddress",
        },
        {
            title: t("dashboard.admin.users.columns.role"),
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
            title: t("dashboard.admin.users.columns.status"),
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => (
                <Tag className={styles.statusTag} color={isActive ? "success" : "warning"}>
                    {isActive ? t("dashboard.admin.users.active") : t("dashboard.admin.users.inactive")}
                </Tag>
            ),
        },
        {
            title: t("dashboard.admin.users.columns.dateJoined"),
            dataIndex: "creationTime",
            key: "creationTime",
            render: (value: string) => new Date(value).toISOString().split("T")[0],
        },
        {
            title: t("dashboard.admin.users.columns.actions"),
            key: "actions",
            render: () => (
                <div className={styles.actions}>
                    <Button type="link" className={styles.editLink}>{t("common.edit")}</Button>
                    <Button type="link" className={styles.disableLink}>{t("dashboard.admin.users.disable")}</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <PageHeader title={t("dashboard.admin.users.title")} subtitle={t("dashboard.admin.users.subtitle")} />

            {error && <Alert type="error" message={error} className={styles.errorAlert} />}

            <div className={styles.toolbar}>
                <Input.Search
                    className={styles.search}
                    placeholder={t("dashboard.admin.users.searchPlaceholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                />
                <div className={styles.filters}>
                    <Select
                        className={styles.filterSelect}
                        options={roleOptions}
                        value={roleFilter}
                        onChange={setRoleFilter}
                    />
                    <Select
                        className={styles.filterSelect}
                        options={statusOptions}
                        value={statusFilter}
                        onChange={setStatusFilter}
                    />
                </div>
                <div className={styles.addButtonWrapper}>
                    <Button type="primary" icon={<PlusOutlined />} className={styles.addButton}>
                        {t("dashboard.admin.users.addUser")}
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
