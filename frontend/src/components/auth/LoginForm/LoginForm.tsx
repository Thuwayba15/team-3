"use client";

import { Alert, Button, Checkbox, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useStyles } from "./style";
import { ILoginValues } from "@/providers/auth/context";

interface ILoginFormProps {
    isLoading: boolean;
    errorMessage: string | null;
    onSubmit: (values: ILoginValues) => Promise<void>;
    onErrorDismiss: () => void;
}

export const LoginForm = ({
    isLoading,
    errorMessage,
    onSubmit,
    onErrorDismiss,
}: ILoginFormProps) => {
    const { styles } = useStyles();
    const [form] = Form.useForm<ILoginValues>();

    const handleFinish = async (values: ILoginValues): Promise<void> => {
        await onSubmit(values);
    };

    return (
        <Form<ILoginValues>
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ rememberClient: true }}
            className={styles.form}
        >
            {errorMessage && (
                <Alert
                    type="error"
                    message={errorMessage}
                    closable
                    onClose={onErrorDismiss}
                    className={styles.errorAlert}
                />
            )}

            <Form.Item
                name="userNameOrEmailAddress"
                label="Username or Email"
                rules={[
                    {
                        required: true,
                        message: "Please enter your username or email.",
                    },
                ]}
            >
                <Input
                    prefix={<UserOutlined />}
                    placeholder="Username or email address"
                    autoComplete="username"
                    autoFocus
                />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[
                    { required: true, message: "Please enter your password." },
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password"
                    autoComplete="current-password"
                />
            </Form.Item>

            <Form.Item name="rememberClient" valuePropName="checked">
                <div className={styles.rememberRow}>
                    <Checkbox>Remember me</Checkbox>
                </div>
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    className={styles.submitButton}
                >
                    Sign in
                </Button>
            </Form.Item>
        </Form>
    );
};
