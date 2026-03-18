"use client";

import { Button, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useStyles } from "./style";
import { ILoginValues } from "@/providers/auth/context";

const { Text } = Typography;

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
            onValuesChange={() => {
                if (errorMessage) {
                    onErrorDismiss();
                }
            }}
            initialValues={{ rememberClient: true }}
            className={styles.form}
        >

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

            {errorMessage && (
                <Text type="danger" className={styles.inlineError} role="alert">
                    {errorMessage}
                </Text>
            )}

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
