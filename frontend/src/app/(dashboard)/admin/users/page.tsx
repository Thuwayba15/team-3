"use client";

import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Input, Pagination, Select, Space, Table, Tag, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import {
    userService,
    type ICreateUserInput,
    type IPagedResult,
    type IRoleOption,
    type IUpdateUserInput,
    type IUser,
} from "@/services/users/userService";
import { UserFormModal } from "./UserFormModal";
import { useStyles } from "./styles";

const { Text } = Typography;

type RoleTagClass = "roleTagAdmin" | "roleTagTutor" | "roleTagParent" | "roleTagStudent";
type StatusFilter = "" | "active" | "inactive";

const ROLE_CLASS_BY_NAME: Record<string, RoleTagClass> = {
    ADMIN: "roleTagAdmin",
    Admin: "roleTagAdmin",
    TUTOR: "roleTagTutor",
    Tutor: "roleTagTutor",
    PARENT: "roleTagParent",
    Parent: "roleTagParent",
    STUDENT: "roleTagStudent",
    Student: "roleTagStudent",
};

const PAGE_SIZE = 10;

function normalizeRoleName(roleName: string): string {
    return roleName.trim().toUpperCase();
}

function formatRoleLabel(roleName: string): string {
    const normalized = normalizeRoleName(roleName);

    if (normalized.length === 0) {
        return "Unassigned";
    }

    return normalized.charAt(0) + normalized.slice(1).toLowerCase();
}

function formatDate(value: string | null): string {
    if (!value) {
        return "Never";
    }

    return new Intl.DateTimeFormat("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(value));
}

export default function AdminUsersPage() {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const [usersResult, setUsersResult] = useState<IPagedResult<IUser>>({ totalCount: 0, items: [] });
    const [roles, setRoles] = useState<IRoleOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [searchDraft, setSearchDraft] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await userService.getAll({
                keyword: search || undefined,
                isActive:
                    statusFilter === ""
                        ? undefined
                        : statusFilter === "active",
                roleName: roleFilter || undefined,
                skipCount: (currentPage - 1) * PAGE_SIZE,
                maxResultCount: PAGE_SIZE,
                sorting: "CreationTime DESC",
            });
            setUsersResult(data);
        } catch {
            setError(t("dashboard.admin.users.errorLoadUsers"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        userService.getRoles()
            .then((availableRoles) => setRoles(availableRoles))
            .catch(() => {
                messageApi.error(t("dashboard.admin.users.errorLoadRoles"));
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        userService.getAll({
            keyword: search || undefined,
            isActive:
                statusFilter === ""
                    ? undefined
                    : statusFilter === "active",
            roleName: roleFilter || undefined,
            skipCount: (currentPage - 1) * PAGE_SIZE,
            maxResultCount: PAGE_SIZE,
            sorting: "CreationTime DESC",
        })
            .then((data) => setUsersResult(data))
            .catch(() => setError(t("dashboard.admin.users.errorLoadUsers")))
            .finally(() => setLoading(false));
    }, [currentPage, roleFilter, search, statusFilter]);

    const roleOptions = useMemo(() => ([
        { label: t("dashboard.admin.users.allRoles"), value: "" },
        ...roles.map((role) => ({
            label: role.displayName || role.name,
            value: role.normalizedName || normalizeRoleName(role.name),
        })),
    ]), [roles, t]);

    const statusOptions = [
        { label: t("dashboard.admin.users.allStatus"), value: "" },
        { label: t("dashboard.admin.users.active"), value: "active" },
        { label: t("dashboard.admin.users.inactive"), value: "inactive" },
    ];

    const openCreateModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user: IUser) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleSubmit = async (values: ICreateUserInput | IUpdateUserInput) => {
        setSubmitLoading(true);

        try {
            if ("id" in values) {
                await userService.update(values);
                messageApi.success(t("dashboard.admin.users.updated"));
            } else {
                await userService.create(values);
                messageApi.success(t("dashboard.admin.users.created"));
                setCurrentPage(1);
            }

            closeModal();
            await loadUsers();
        } catch {
            messageApi.error(
                "id" in values
                    ? t("dashboard.admin.users.errorUpdateUser")
                    : t("dashboard.admin.users.errorCreateUser")
            );
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleToggleStatus = async (user: IUser) => {
        try {
            if (user.isActive) {
                await userService.deactivate(user.id);
                messageApi.success(t("dashboard.admin.users.deactivated"));
            } else {
                await userService.activate(user.id);
                messageApi.success(t("dashboard.admin.users.activated"));
            }

            await loadUsers();
        } catch {
            messageApi.error(t("dashboard.admin.users.errorToggleStatus"));
        }
    };

    const columns: ColumnsType<IUser> = [
        {
            title: t("dashboard.admin.users.columns.name"),
            dataIndex: "fullName",
            key: "fullName",
            render: (_value: string, user) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{user.fullName}</Text>
                    <Text className={styles.userNameText}>@{user.userName}</Text>
                </Space>
            ),
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
                    return <Tag className={`${styles.roleTag} ${styles.roleTagDefault}`}>Unassigned</Tag>;
                }

                return roleNames.map((role) => {
                    const normalizedRoleName = normalizeRoleName(role);
                    const roleClassName = ROLE_CLASS_BY_NAME[normalizedRoleName] ?? "roleTagDefault";
                    return (
                        <Tag key={role} className={`${styles.roleTag} ${styles[roleClassName]}`}>
                            {formatRoleLabel(role)}
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
                <div className={styles.statusCell}>
                    <Tag className={styles.statusTag} color={isActive ? "success" : "warning"}>
                        {isActive ? t("dashboard.admin.users.active") : t("dashboard.admin.users.inactive")}
                    </Tag>
                </div>
            ),
        },
        {
            title: t("dashboard.admin.users.columns.dateJoined"),
            dataIndex: "creationTime",
            key: "creationTime",
            render: (value: string) => formatDate(value),
        },
        {
            title: t("dashboard.admin.users.columns.actions"),
            key: "actions",
            render: (_value, user) => (
                <div className={styles.actions}>
                    <Button type="link" className={styles.editLink} onClick={() => openEditModal(user)}>
                        {t("common.edit")}
                    </Button>
                    <Button
                        type="link"
                        className={user.isActive ? styles.disableLink : styles.activateLink}
                        onClick={() => void handleToggleStatus(user)}
                    >
                        {user.isActive
                            ? t("dashboard.admin.users.disable")
                            : t("dashboard.admin.users.enable")}
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            {contextHolder}
            <PageHeader title={t("dashboard.admin.users.title")} subtitle={t("dashboard.admin.users.subtitle")} />

            {error ? <Alert type="error" message={error} className={styles.errorAlert} /> : null}

            <Card className={styles.card}>
                <div className={styles.toolbar}>
                        <Input.Search
                            className={styles.search}
                            placeholder={t("dashboard.admin.users.searchPlaceholder")}
                            value={searchDraft}
                            onChange={(event) => {
                                const nextValue = event.target.value;
                                setSearchDraft(nextValue);
                                if (nextValue.length === 0) {
                                    setCurrentPage(1);
                                    setSearch("");
                                }
                            }}
                            onSearch={(value) => {
                                setCurrentPage(1);
                                setSearch(value.trim());
                            }}
                            allowClear
                        />

                    <div className={styles.filters}>
                        <Select
                            className={styles.filterSelect}
                            options={roleOptions}
                            value={roleFilter}
                            onChange={(value) => {
                                setCurrentPage(1);
                                setRoleFilter(value);
                            }}
                        />
                        <Select
                            className={styles.filterSelect}
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(value) => {
                                setCurrentPage(1);
                                setStatusFilter(value);
                            }}
                        />
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => {
                                setCurrentPage(1);
                                void loadUsers();
                            }}
                        >
                            {t("dashboard.admin.users.refresh")}
                        </Button>
                    </div>

                    <div className={styles.addButtonWrapper}>
                        <Button type="primary" icon={<PlusOutlined />} className={styles.addButton} onClick={openCreateModal}>
                            {t("dashboard.admin.users.addUser")}
                        </Button>
                    </div>
                </div>

                <Table
                    className={styles.table}
                    columns={columns}
                    dataSource={usersResult.items}
                    rowKey="id"
                    pagination={false}
                    loading={loading}
                    bordered={false}
                    locale={{ emptyText: t("empty.noData") }}
                    scroll={{ x: "max-content" }}
                />

                <div className={styles.paginationRow}>
                    <Pagination
                        current={currentPage}
                        pageSize={PAGE_SIZE}
                        total={usersResult.totalCount}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                    />
                </div>
            </Card>

            <UserFormModal
                open={isModalOpen}
                loading={submitLoading}
                roles={roles}
                user={selectedUser}
                onCancel={closeModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
