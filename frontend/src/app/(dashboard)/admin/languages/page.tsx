"use client";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Form, Input, InputNumber, Popconfirm, Row, Spin, Switch, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { languageService, ILanguage, ICreateLanguageRequest } from "@/services/configuration/languageService";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

const TONE_CLASSES = ["toneInfo", "tonePrimary", "toneWarning", "toneSuccess", "toneError"] as const;
type ToneClassName = typeof TONE_CLASSES[number];

function getToneForIndex(index: number): ToneClassName {
    return TONE_CLASSES[index % TONE_CLASSES.length];
}

/** Admin language management page. */
export default function AdminLanguagesPage() {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();

    const [languages, setLanguages] = useState<ILanguage[]>([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form] = Form.useForm<ICreateLanguageRequest>();

    useEffect(() => {
        languageService.getAll()
            .then(setLanguages)
            .catch(() => messageApi.error("Failed to load languages."))
            .finally(() => setLoading(false));
    }, []);

    const handleToggleActive = async (language: ILanguage, checked: boolean): Promise<void> => {
        try {
            const updated = await languageService.update(language.id, {
                name: language.name,
                nativeName: language.nativeName ?? "",
                isActive: checked,
                isDefault: language.isDefault,
                sortOrder: language.sortOrder,
            });
            setLanguages((previous) => previous.map((l) => (l.id === updated.id ? updated : l)));
        } catch {
            messageApi.error("Failed to update language.");
        }
    };

    const handleDeleteLanguage = async (id: string): Promise<void> => {
        try {
            await languageService.remove(id);
            setLanguages((previous) => previous.filter((l) => l.id !== id));
            messageApi.success("Language deleted.");
        } catch {
            messageApi.error("Failed to delete language.");
        }
    };

    const handleCreateLanguage = async (values: ICreateLanguageRequest): Promise<void> => {
        setCreating(true);
        try {
            const created = await languageService.create({ ...values, isActive: true });
            setLanguages((previous) => [...previous, created]);
            messageApi.success("Language created.");
            setCreateModalOpen(false);
            form.resetFields();
        } catch {
            messageApi.error("Failed to create language.");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            {contextHolder}

            <PageHeader
                title={t("dashboard.admin.languages.title")}
                subtitle={t("dashboard.admin.languages.subtitle")}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
                    Add Language
                </Button>
            </div>

            <Spin spinning={loading}>
                {!loading && languages.length === 0 ? (
                    <Empty description="No languages configured yet." />
                ) : (
                    <Row gutter={[16, 16]} className={styles.languageCardsRow}>
                        {languages.map((language, index) => (
                            <Col key={language.id} xs={24} md={12}>
                                <Card className={styles.languageCard}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.languageMeta}>
                                            <span className={`${styles.languageCode} ${(styles as Record<string, string>)[getToneForIndex(index)]}`}>
                                                {language.code.toUpperCase()}
                                            </span>
                                            <div>
                                                <Title level={4} className={styles.languageName}>{language.name}</Title>
                                                {language.nativeName && (
                                                    <Text type="secondary" style={{ fontSize: 12 }}>{language.nativeName}</Text>
                                                )}
                                            </div>
                                        </div>
                                        <Space>
                                            <Switch
                                                checked={language.isActive}
                                                onChange={(checked) => handleToggleActive(language, checked)}
                                            />
                                            <Popconfirm
                                                title="Delete language?"
                                                description="This action cannot be undone."
                                                okText="Delete"
                                                cancelText="Cancel"
                                                onConfirm={() => handleDeleteLanguage(language.id)}
                                            >
                                                <Button danger icon={<DeleteOutlined />} size="small" />
                                            </Popconfirm>
                                        </Space>
                                    </div>
                                    {language.isDefault && (
                                        <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 8 }}>
                                            Default language
                                        </Text>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Spin>

            {/* Create Language Modal */}
            <Form.Provider>
                <div>
                    {createModalOpen && (
                        <Card
                            title="Add Language"
                            style={{ marginTop: 16 }}
                            extra={
                                <Button onClick={() => { setCreateModalOpen(false); form.resetFields(); }}>
                                    Cancel
                                </Button>
                            }
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleCreateLanguage}
                                initialValues={{ isDefault: false, isActive: true, sortOrder: 0 }}
                            >
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item name="code" label="Language Code" rules={[{ required: true }]}>
                                            <Input placeholder="e.g. zu" maxLength={10} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                            <Input placeholder="e.g. isiZulu" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item name="nativeName" label="Native Name">
                                            <Input placeholder="e.g. isiZulu" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={6}>
                                        <Form.Item name="sortOrder" label="Sort Order">
                                            <InputNumber min={0} style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={6}>
                                        <Form.Item name="isDefault" label="Set as Default" valuePropName="checked">
                                            <Switch />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Button type="primary" htmlType="submit" loading={creating}>
                                    Create Language
                                </Button>
                            </Form>
                        </Card>
                    )}
                </div>
            </Form.Provider>
        </div>
    );
}
