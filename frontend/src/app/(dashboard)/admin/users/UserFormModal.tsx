"use client";

import { Button, Checkbox, Form, Input, Modal, Select, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type {
    ICreateUserInput,
    IRoleOption,
    IUpdateUserInput,
    IUser,
} from "@/services/users/userService";
import { toAdminRoleSelectOptions } from "@/services/users/roleOptions";
import { useStyles } from "./styles";

const { Text } = Typography;

export interface IUserFormValues {
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    password?: string;
    roleNames: string[];
}

interface IUserFormModalProps {
    open: boolean;
    loading: boolean;
    roles: IRoleOption[];
    user: IUser | null;
    onCancel: () => void;
    onSubmit: (values: ICreateUserInput | IUpdateUserInput) => Promise<void>;
}

function toInitialValues(user: IUser | null): IUserFormValues {
    if (!user) {
        return {
            userName: "",
            name: "",
            surname: "",
            emailAddress: "",
            isActive: true,
            password: "",
            roleNames: [],
        };
    }

    return {
        userName: user.userName,
        name: user.name,
        surname: user.surname,
        emailAddress: user.emailAddress,
        isActive: user.isActive,
        roleNames: user.roleNames,
    };
}

export function UserFormModal({
    open,
    loading,
    roles,
    user,
    onCancel,
    onSubmit,
}: IUserFormModalProps) {
    const { t } = useTranslation();
    const { styles } = useStyles();
    const [form] = Form.useForm<IUserFormValues>();
    const isEditing = Boolean(user);

    useEffect(() => {
        if (!open) {
            return;
        }

        form.setFieldsValue(toInitialValues(user));
    }, [form, open, user]);

    const handleFinish = async (values: IUserFormValues) => {
        if (user) {
            await onSubmit({
                id: user.id,
                userName: values.userName.trim(),
                name: values.name.trim(),
                surname: values.surname.trim(),
                emailAddress: values.emailAddress.trim(),
                isActive: values.isActive,
                roleNames: values.roleNames,
            });
            return;
        }

        await onSubmit({
            userName: values.userName.trim(),
            name: values.name.trim(),
            surname: values.surname.trim(),
            emailAddress: values.emailAddress.trim(),
            isActive: values.isActive,
            password: values.password?.trim() ?? "",
            roleNames: values.roleNames,
        });
    };

    return (
        <Modal
            open={open}
            title={isEditing ? t("dashboard.admin.users.editUser") : t("dashboard.admin.users.addUser")}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Text className={styles.modalHint}>
                {isEditing
                    ? t("dashboard.admin.users.editUserHint")
                    : t("dashboard.admin.users.addUserHint")}
            </Text>

            <Form<IUserFormValues>
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={toInitialValues(user)}
            >
                <div className={styles.nameRow}>
                    <Form.Item
                        name="name"
                        label={t("auth.register.firstName")}
                        rules={[{ required: true, message: t("dashboard.admin.users.validation.firstName") }]}
                    >
                        <Input maxLength={32} />
                    </Form.Item>

                    <Form.Item
                        name="surname"
                        label={t("auth.register.surname")}
                        rules={[{ required: true, message: t("dashboard.admin.users.validation.surname") }]}
                    >
                        <Input maxLength={32} />
                    </Form.Item>
                </div>

                <Form.Item
                    name="userName"
                    label={t("header.username")}
                    rules={[{ required: true, message: t("dashboard.admin.users.validation.userName") }]}
                >
                    <Input maxLength={32} />
                </Form.Item>

                <Form.Item
                    name="emailAddress"
                    label={t("auth.register.email")}
                    rules={[
                        { required: true, message: t("dashboard.admin.users.validation.email") },
                        { type: "email", message: t("dashboard.admin.users.validation.emailFormat") },
                    ]}
                >
                    <Input />
                </Form.Item>

                {!isEditing ? (
                    <Form.Item
                        name="password"
                        label={t("auth.register.password")}
                        rules={[
                            { required: true, message: t("dashboard.admin.users.validation.password") },
                            { min: 6, message: t("dashboard.admin.users.validation.passwordMin") },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                ) : null}

                <Form.Item
                    name="roleNames"
                    label={t("dashboard.admin.users.columns.role")}
                    rules={[{ required: true, message: t("dashboard.admin.users.validation.roles") }]}
                >
                    <Select
                        mode="multiple"
                        optionFilterProp="label"
                        options={toAdminRoleSelectOptions(roles)}
                    />
                </Form.Item>

                <Form.Item name="isActive" valuePropName="checked">
                    <Checkbox>{t("dashboard.admin.users.keepUserActive")}</Checkbox>
                </Form.Item>

                <div className={styles.modalActions}>
                    <Button onClick={onCancel}>{t("common.cancel")}</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {isEditing ? t("common.save") : t("common.submit")}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
