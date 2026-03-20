"use client";

import { Button, Checkbox, Empty, Modal, Tag, Typography } from "antd";
import type { IStudentSubject } from "@/services/student/studentSubjectService";
import { useStyles } from "./SubjectEnrollmentModal.styles";

const { Text } = Typography;

interface ISubjectEnrollmentModalProps {
    open: boolean;
    loading: boolean;
    submitting: boolean;
    subjects: IStudentSubject[];
    enrolledSubjectIds: string[];
    selectedSubjectIds: string[];
    onCancel: () => void;
    onSelectionChange: (subjectIds: string[]) => void;
    onSubmit: () => Promise<void>;
}

export default function SubjectEnrollmentModal({
    open,
    loading,
    submitting,
    subjects,
    enrolledSubjectIds,
    selectedSubjectIds,
    onCancel,
    onSelectionChange,
    onSubmit,
}: ISubjectEnrollmentModalProps) {
    const { styles } = useStyles();

    const toggleSubject = (subjectId: string) => {
        if (enrolledSubjectIds.includes(subjectId)) {
            return;
        }

        if (selectedSubjectIds.includes(subjectId)) {
            onSelectionChange(selectedSubjectIds.filter((id) => id !== subjectId));
            return;
        }

        onSelectionChange([...selectedSubjectIds, subjectId]);
    };

    return (
        <Modal
            open={open}
            title="Enroll in subjects"
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Text className={styles.description}>
                Select one or more active subjects to add them to your learning path.
            </Text>

            {subjects.length === 0 && !loading ? (
                <Empty description="No subjects are available right now." />
            ) : (
                <div className={styles.list}>
                    {subjects.map((subject) => {
                        const isEnrolled = enrolledSubjectIds.includes(subject.id);
                        const isSelected = selectedSubjectIds.includes(subject.id);

                        return (
                            <div
                                key={subject.id}
                                className={`${styles.card} ${isSelected ? styles.cardSelected : ""} ${isEnrolled ? styles.cardDisabled : ""}`}
                                onClick={() => toggleSubject(subject.id)}
                                role="button"
                                tabIndex={isEnrolled ? -1 : 0}
                                onKeyDown={(event) => {
                                    if ((event.key === "Enter" || event.key === " ") && !isEnrolled) {
                                        event.preventDefault();
                                        toggleSubject(subject.id);
                                    }
                                }}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.titleWrap}>
                                        <Text strong>{subject.name}</Text>
                                        <Text className={styles.grade}>{subject.gradeLevel}</Text>
                                    </div>

                                    {isEnrolled ? (
                                        <Tag color="success">Enrolled</Tag>
                                    ) : (
                                        <Checkbox checked={isSelected} />
                                    )}
                                </div>

                                {subject.description ? (
                                    <Text className={styles.descriptionText}>{subject.description}</Text>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={styles.footer}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button
                    type="primary"
                    loading={submitting}
                    disabled={selectedSubjectIds.length === 0 || loading}
                    onClick={() => void onSubmit()}
                >
                    Enroll selected subjects
                </Button>
            </div>
        </Modal>
    );
}
