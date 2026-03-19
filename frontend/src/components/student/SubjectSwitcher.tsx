"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { IStudentSubject } from "@/services/student/studentSubjectService";
import { useStyles } from "./SubjectSwitcher.styles";

interface ISubjectSwitcherProps {
    subjects: IStudentSubject[];
    activeSubjectId: string | null;
    onSelectSubject: (subjectId: string) => void;
    onAddSubjects?: () => void;
}

export default function SubjectSwitcher({
    subjects,
    activeSubjectId,
    onSelectSubject,
    onAddSubjects,
}: ISubjectSwitcherProps) {
    const { styles } = useStyles();

    if (subjects.length === 0) {
        return null;
    }

    return (
        <div className={styles.root}>
            {subjects.map((subject) => (
                <button
                    key={subject.id}
                    className={`${styles.subjectTab} ${activeSubjectId === subject.id ? styles.subjectTabActive : ""}`}
                    onClick={() => onSelectSubject(subject.id)}
                    type="button"
                >
                    {subject.name}
                </button>
            ))}

            {onAddSubjects ? (
                <Button
                    icon={<PlusOutlined />}
                    className={styles.addButton}
                    onClick={onAddSubjects}
                >
                    Add subjects
                </Button>
            ) : null}
        </div>
    );
}
