"use client";
import React from "react";
import { Form, Input, Button, Select, Typography } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";
import { IRegisterValues } from "@/providers/auth/context";
import { useStyles } from "./style";

const { Text } = Typography;

interface RegisterFormProps {
  onSubmit: (values: IRegisterValues) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onErrorDismiss: () => void;
}

export const RegisterForm = ({ onSubmit, isLoading, errorMessage, onErrorDismiss }: RegisterFormProps) => {
  const { styles } = useStyles();

  return (
    <Form
      layout="vertical"
      onFinish={onSubmit}
      onValuesChange={() => {
        if (errorMessage) {
          onErrorDismiss();
        }
      }}
      requiredMark={false}
      className={styles.form}
    >

      <div className={styles.nameRow}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Required" }]}
          className={styles.nameField}
        >
          <Input prefix={<IdcardOutlined />} placeholder="First Name" />
        </Form.Item>

        <Form.Item
          name="surname"
          rules={[{ required: true, message: "Required" }]}
          className={styles.nameField}
        >
          <Input prefix={<IdcardOutlined />} placeholder="Last Name" />
        </Form.Item>
      </div>

      <Form.Item name="userName" rules={[{ required: true, message: "Please input a username" }]}>
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>

      <Form.Item name="emailAddress" rules={[{ required: true, type: "email", message: "Valid email required" }]}>
        <Input prefix={<MailOutlined />} placeholder="Email Address" />
      </Form.Item>

      <Form.Item name="role" rules={[{ required: true, message: "Please select your role" }]}>
        <Select placeholder="I am a...">
          <Select.Option value="Student">Student</Select.Option>
          <Select.Option value="Tutor">Tutor</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Password is required" },
          {
            pattern: /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!\s)[0-9a-zA-Z!@#$%^&*()]*$/,
            message: "Min 8 characters with at least one uppercase letter, lowercase letter, and number",
          },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      {errorMessage && (
        <Text type="danger" className={styles.inlineError} role="alert">
          {errorMessage}
        </Text>
      )}

      <Button type="primary" htmlType="submit" loading={isLoading} className={styles.submitButton}>
        Sign Up
      </Button>
    </Form>
  );
};
