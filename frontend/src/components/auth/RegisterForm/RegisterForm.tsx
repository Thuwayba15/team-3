"use client";
import React from "react";
import { Form, Input, Button, Select, Alert } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";
import { IRegisterValues } from "@/providers/auth/context";

interface RegisterFormProps {
  onSubmit: (values: IRegisterValues) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onErrorDismiss: () => void;
}

export const RegisterForm = ({ onSubmit, isLoading, errorMessage, onErrorDismiss }: RegisterFormProps) => {
  return (
    <Form layout="vertical" onFinish={onSubmit} requiredMark={false}>
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          closable
          onClose={onErrorDismiss}
          style={{ marginBottom: 24, borderRadius: 12 }}
        />
      )}

      {/* Row for Name & Surname */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Form.Item name="name" rules={[{ required: true, message: 'Required' }]} style={{ flex: 1 }}>
          <Input prefix={<IdcardOutlined />} placeholder="First Name" />
        </Form.Item>
        <Form.Item name="surname" rules={[{ required: true, message: 'Required' }]} style={{ flex: 1 }}>
          <Input prefix={<IdcardOutlined />} placeholder="Last Name" />
        </Form.Item>
      </div>

      <Form.Item name="userName" rules={[{ required: true, message: 'Please input a username' }]}>
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>

      <Form.Item name="emailAddress" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
        <Input prefix={<MailOutlined />} placeholder="Email Address" />
      </Form.Item>

      <Form.Item name="role" rules={[{ required: true, message: 'Please select your role' }]}>
        <Select placeholder="I am a...">
          <Select.Option value="Student">Student</Select.Option>
          <Select.Option value="Parent">Parent</Select.Option>
          <Select.Option value="Tutor">Tutor</Select.Option>
          <Select.Option value="Admin">Admin</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Min 6 characters' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={isLoading}>
        Sign Up
      </Button>
    </Form>
  );
};