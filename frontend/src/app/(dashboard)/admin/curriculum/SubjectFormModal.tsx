"use client";

import { Form, Input, Modal } from "antd";
import type { FormInstance } from "antd";
import type { ISubjectFormValues } from "./types";
import { useStyles } from "./styles";

interface ISubjectFormModalProps {
    open: boolean;
    editingSubjectId: string | null;
    form: FormInstance<ISubjectFormValues>;
    onCancel: () => void;
    onOk: () => Promise<void>;
}

export function SubjectFormModal({ open, editingSubjectId, form, onCancel, onOk }: ISubjectFormModalProps) {
    const { styles } = useStyles();

    return (
        <Modal
            title={editingSubjectId ? "Edit Subject" : "Create Subject"}
            open={open}
            onCancel={onCancel}
            onOk={onOk}
            okText={editingSubjectId ? "Save Changes" : "Create Subject"}
        >
            <Form form={form} layout="vertical" className={styles.subjectForm}>
                <Form.Item<ISubjectFormValues>
                    label="Subject Name"
                    name="name"
                    rules={[{ required: true, message: "Subject name is required." }]}
                >
                    <Input placeholder="e.g. Mathematics" />
                </Form.Item>

                <Form.Item<ISubjectFormValues>
                    label="Grade Level"
                    name="gradeLevel"
                    rules={[{ required: true, message: "Grade level is required." }]}
                >
                    <Input placeholder="e.g. Grade 10" />
                </Form.Item>

                <Form.Item<ISubjectFormValues>
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Description is required." }]}
                >
                    <Input.TextArea rows={4} placeholder="Briefly describe the subject curriculum scope." />
                </Form.Item>
            </Form>
        </Modal>
    );
}
