"use client";

import { Card, Col, Progress, Row, Switch, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

interface ILanguageOverview {
    id: string;
    name: string;
    code: string;
    toneClassName: "toneInfo" | "tonePrimary" | "toneWarning" | "toneSuccess";
    progress: number;
    translatedItems: string;
}

interface IContentTypeProgress {
    key: string;
    contentType: string;
    english: number;
    isiZulu: number;
    sesotho: number;
    afrikaans: number;
}

const LANGUAGE_OVERVIEW_DATA: ILanguageOverview[] = [
    { id: "en", name: "English", code: "EN", toneClassName: "toneInfo", progress: 100, translatedItems: "1,240" },
    { id: "zu", name: "isiZulu", code: "ZU", toneClassName: "tonePrimary", progress: 78, translatedItems: "967" },
    { id: "st", name: "Sesotho", code: "ST", toneClassName: "toneWarning", progress: 62, translatedItems: "768" },
    { id: "af", name: "Afrikaans", code: "AF", toneClassName: "toneSuccess", progress: 85, translatedItems: "1,054" },
];

const CONTENT_PROGRESS_DATA: IContentTypeProgress[] = [
    { key: "ui-labels", contentType: "UI Labels", english: 100, isiZulu: 100, sesotho: 95, afrikaans: 100 },
    { key: "lessons", contentType: "Lessons", english: 100, isiZulu: 75, sesotho: 60, afrikaans: 85 },
    { key: "quiz-questions", contentType: "Quiz Questions", english: 100, isiZulu: 70, sesotho: 55, afrikaans: 80 },
    { key: "notifications", contentType: "Notifications", english: 100, isiZulu: 90, sesotho: 85, afrikaans: 95 },
    { key: "system-messages", contentType: "System Messages", english: 100, isiZulu: 85, sesotho: 75, afrikaans: 90 },
];

/** Returns a semantic class name based on translation progress percentage. */
function getProgressToneClassName(value: number): "progressHigh" | "progressMid" | "progressLow" {
    if (value >= 80) {
        return "progressHigh";
    }
    if (value >= 50) {
        return "progressMid";
    }
    return "progressLow";
}

/** Admin language management page for translation coverage and language support status. */
export default function AdminLanguagesPage() {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const [activeLanguageIds, setActiveLanguageIds] = useState<string[]>(LANGUAGE_OVERVIEW_DATA.map((language) => language.id));

    const columns: ColumnsType<IContentTypeProgress> = useMemo(() => [
        {
            title: t("dashboard.admin.languages.contentType"),
            dataIndex: "contentType",
            key: "contentType",
            render: (value: string) => <span className={styles.contentTypeValue}>{value}</span>,
        },
        {
            title: "English",
            dataIndex: "english",
            key: "english",
            render: (value: number) => <span className={`${styles.progressValue} ${styles[getProgressToneClassName(value)]}`}>{value}%</span>,
        },
        {
            title: "isiZulu",
            dataIndex: "isiZulu",
            key: "isiZulu",
            render: (value: number) => <span className={`${styles.progressValue} ${styles[getProgressToneClassName(value)]}`}>{value}%</span>,
        },
        {
            title: "Sesotho",
            dataIndex: "sesotho",
            key: "sesotho",
            render: (value: number) => <span className={`${styles.progressValue} ${styles[getProgressToneClassName(value)]}`}>{value}%</span>,
        },
        {
            title: "Afrikaans",
            dataIndex: "afrikaans",
            key: "afrikaans",
            render: (value: number) => <span className={`${styles.progressValue} ${styles[getProgressToneClassName(value)]}`}>{value}%</span>,
        },
    ], [styles, t]);

    const handleToggleLanguage = (languageId: string, checked: boolean): void => {
        setActiveLanguageIds((previousIds) => {
            if (checked) {
                return previousIds.includes(languageId) ? previousIds : [...previousIds, languageId];
            }
            return previousIds.filter((id) => id !== languageId);
        });
    };

    return (
        <div>
            <PageHeader
                title={t("dashboard.admin.languages.title")}
                subtitle={t("dashboard.admin.languages.subtitle")}
            />

            <Row gutter={[16, 16]} className={styles.languageCardsRow}>
                {LANGUAGE_OVERVIEW_DATA.map((language) => {
                    const isActive = activeLanguageIds.includes(language.id);
                    return (
                        <Col key={language.id} xs={24} md={12}>
                            <Card className={styles.languageCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.languageMeta}>
                                        <span className={`${styles.languageCode} ${styles[language.toneClassName]}`}>{language.code}</span>
                                        <Title level={4} className={styles.languageName}>{language.name}</Title>
                                    </div>
                                    <Switch checked={isActive} onChange={(checked) => handleToggleLanguage(language.id, checked)} />
                                </div>

                                <div className={styles.progressBlock}>
                                    <div className={styles.progressHeader}>
                                        <Text className={styles.progressLabel}>{t("dashboard.admin.languages.translationProgress")}</Text>
                                        <Text className={styles.progressPercent}>{language.progress}%</Text>
                                    </div>
                                    <Progress
                                        className={styles.translationProgress}
                                        percent={language.progress}
                                        showInfo={false}
                                        status={isActive ? "active" : "normal"}
                                    />
                                    <Text className={styles.translatedItemsText}>{`${language.translatedItems} ${t("dashboard.admin.languages.contentItemsTranslated")}`}</Text>
                                </div>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <Card title={t("dashboard.admin.languages.translationStatusByContentType")} className={styles.tableCard}>
                <Table
                    className={styles.table}
                    columns={columns}
                    dataSource={CONTENT_PROGRESS_DATA}
                    pagination={false}
                    rowKey="key"
                    scroll={{ x: "max-content" }}
                />
            </Card>
        </div>
    );
}
