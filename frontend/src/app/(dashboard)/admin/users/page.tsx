"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Modal, Select, Space, Spin, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout";
import { userService, type ICreateUserInput, type IUser } from "@/services/users/userService";
import { useStyles } from "./styles";

const ROLE_OPTIONS = [
    { label: "Student", value: "Student" },
    { label: "Admin", value: "Admin" },
];

export default function AdminUsersPage() {
    const { styles } = useStyles();
    const [form] = Form.useForm<ICreateUserInput>();
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const result = await userService.getAll();
            setUsers(result.items.filter((user) => user.roleNames.some((role) => role === "ADMIN" || role === "STUDENT")));
            setError(null);
        } catch {
            setError("Could not load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = `${user.fullName} ${user.emailAddress}`.toLowerCase().includes(search.toLowerCase());
            const matchesRole = roleFilter ? user.roleNames.includes(roleFilter.toUpperCase()) : true;
            return matchesSearch && matchesRole;
        });
    }, [roleFilter, search, users]);

    const handleCreate = async () => {
        setSaving(true);
        try {
            const values = await form.validateFields();
            await userService.create(values);
            form.resetFields();
            setIsCreateOpen(false);
            message.success("User created.");
            await loadUsers();
        } catch {
            message.error("Could not create user.");
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (user: IUser) => {
        try {
            if (user.isActive) {
                await userService.deactivate(user.id);
                message.success("User deactivated.");
            } else {
                await userService.activate(user.id);
                message.success("User activated.");
            }
            await loadUsers();
        } catch {
            message.error("Could not update user status.");
        }
    };

    const columns: ColumnsType<IUser> = [
        {
            title: "Name",
            dataIndex: "fullName",
            key: "fullName",
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
            render: (roles: string[]) => roles
                .filter((role) => role === "ADMIN" || role === "STUDENT")
                .map((role) => <Tag key={role}>{role === "ADMIN" ? "Admin" : "Student"}</Tag>),
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => <Tag color={isActive ? "success" : "default"}>{isActive ? "Active" : "Inactive"}</Tag>,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_value, record) => (
                <Button type="link" onClick={() => void toggleStatus(record)}>
                    {record.isActive ? "Deactivate" : "Activate"}
                </Button>
            ),
        },
    ];

    return (
        <div>
            <PageHeader title="Users" subtitle="Manage admin and student accounts for the MVP." />

            {error && <Alert type="error" message={error} className={styles.errorAlert} />}

            <div className={styles.toolbar}>
                <Input.Search
                    className={styles.search}
                    placeholder="Search users"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    allowClear
                />

                <Space>
                    <Select
                        style={{ width: 180 }}
                        value={roleFilter}
                        onChange={setRoleFilter}
                        options={[{ label: "All roles", value: "" }, ...ROLE_OPTIONS]}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateOpen(true)}>
                        Add User
                    </Button>
                </Space>
            </div>

            <Spin spinning={loading}>
                <Table columns={columns} dataSource={filteredUsers} rowKey="id" pagination={false} />
            </Spin>

            <Modal
                title="Create User"
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                onOk={() => void handleCreate()}
                confirmLoading={saving}
            >
                <Form form={form} layout="vertical" initialValues={{ isActive: true, roleNames: ["Student"] }}>
                    <Form.Item name="name" label="First Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="surname" label="Last Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="userName" label="Username" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="emailAddress" label="Email" rules={[{ required: true, type: "email" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, min: 8 }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="roleNames" label="Role" rules={[{ required: true }]}>
                        <Select mode="multiple" maxCount={1} options={ROLE_OPTIONS} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
