"use client";

import {
    Button,
    Card,
    Col,
    Empty,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Row,
    Skeleton,
    Select,
    Slider,
    Space,
    Switch,
    Typography,
    message,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { AIPromptTemplateProvider, useAIPromptTemplateActions, useAIPromptTemplateState } from "@/providers/aiPromptTemplate";
import { IAIPromptTemplate } from "@/services/ai/aiPromptTemplateService";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

type ProgressionMode = "Adaptive (AI-driven)" | "Linear (Strict sequence)" | "Custom";

/** Inner content — consumes the AIPromptTemplateProvider. */
function AiConfigurationContent() {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();

    const { templates, isLoading, isError, errorMessage } = useAIPromptTemplateState();
    const { getTemplates, createTemplate, deleteTemplate } = useAIPromptTemplateActions();

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form] = Form.useForm<Omit<IAIPromptTemplate, "id">>();

    const [masteryThreshold, setMasteryThreshold] = useState(70);
    const [maxRetryAttempts, setMaxRetryAttempts] = useState(3);
    const [difficultyProgression, setDifficultyProgression] = useState<ProgressionMode>("Adaptive (AI-driven)");
    const [recommendationWeight, setRecommendationWeight] = useState(80);

    const [autoAdjustDifficulty, setAutoAdjustDifficulty] = useState(true);
    const [adjustmentSensitivity, setAdjustmentSensitivity] = useState(50);
    const [minimumQuestionsBeforeAdjustment, setMinimumQuestionsBeforeAdjustment] = useState(5);
    const [increaseThreshold, setIncreaseThreshold] = useState(80);
    const [decreaseThreshold, setDecreaseThreshold] = useState(40);

    useEffect(() => {
        getTemplates();
    }, []);

    useEffect(() => {
        if (isError && errorMessage) {
            messageApi.error(errorMessage);
        }
    }, [isError, errorMessage]);

    const handleDeleteTemplate = async (id: string): Promise<void> => {
        await deleteTemplate(id);
        messageApi.success("Prompt template deleted.");
    };

    const handleCreateTemplate = async (values: Omit<IAIPromptTemplate, "id">): Promise<void> => {
        setCreating(true);
        await createTemplate(values);
        setCreating(false);
        setCreateModalOpen(false);
        form.resetFields();
        messageApi.success(t("dashboard.admin.aiConfiguration.templateCreated"));
    };

    const handleSaveConfiguration = (): void => {
        messageApi.success(t("dashboard.admin.aiConfiguration.saved"));
    };

    const templateCardTitle = (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{t("dashboard.admin.aiConfiguration.promptTemplates")}</span>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalOpen(true)}
            >
                {t("dashboard.admin.aiConfiguration.newTemplate")}
            </Button>
        </div>
    );

    return (
        <div>
            {contextHolder}

            <PageHeader
                title={t("dashboard.admin.aiConfiguration.title")}
                subtitle={t("dashboard.admin.aiConfiguration.subtitle")}
            />

            <Card className={styles.sectionCard} title={templateCardTitle}>
                {isLoading ? (
                    <Row gutter={[16, 16]}>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Col key={index} xs={24} lg={8}>
                                <Card className={styles.templateCard}>
                                    <Skeleton active paragraph={{ rows: 6 }} title={{ width: "60%" }} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : !templates || templates.length === 0 ? (
                    <Empty description={t("dashboard.admin.aiConfiguration.noTemplates")} />
                ) : (
                        <Row gutter={[16, 16]}>
                            {templates?.map((template) => (
                                <Col key={template.id} xs={24} lg={8}>
                                    <Card className={styles.templateCard}>
                                        <Title level={5} className={styles.templateTitle}>{template.name}</Title>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{template.purpose}</Text>
                                        <Input.TextArea
                                            className={styles.templateTextArea}
                                            value={template.templateText}
                                            readOnly
                                            autoSize={{ minRows: 6, maxRows: 8 }}
                                        />
                                        <div className={styles.templateActions}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {t("dashboard.admin.aiConfiguration.temperature")}: {template.temperature}
                                            </Text>
                                            <Button className={styles.editButton}>{t("common.edit")}</Button>
                                            <Popconfirm
                                                title="Delete template?"
                                                description="This action cannot be undone."
                                                okText="Delete"
                                                cancelText="Cancel"
                                                onConfirm={() => handleDeleteTemplate(template.id)}
                                            >
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                />
                                            </Popconfirm>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                )}
            </Card>

            <Row gutter={[16, 16]} className={styles.settingsRow}>
                <Col xs={24} lg={12}>
                    <Card className={styles.sectionCard} title={t("dashboard.admin.aiConfiguration.recommendationEngineSettings")}>
                        <Space direction="vertical" size={20} className={styles.settingsStack}>
                            <div>
                                <div className={styles.settingHeader}>
                                    <Text className={styles.settingLabel}>{t("dashboard.admin.aiConfiguration.minimumMasteryThreshold")}</Text>
                                    <Text className={styles.settingValue}>{masteryThreshold}%</Text>
                                </div>
                                <Slider value={masteryThreshold} min={0} max={100} onChange={setMasteryThreshold} className={styles.slider} />
                            </div>

                            <div>
                                <Text className={styles.settingLabelBlock}>{t("dashboard.admin.aiConfiguration.maximumRetryAttempts")}</Text>
                                <InputNumber
                                    className={styles.fullWidthInput}
                                    min={1}
                                    max={10}
                                    value={maxRetryAttempts}
                                    onChange={(value) => setMaxRetryAttempts(typeof value === "number" ? value : 1)}
                                />
                            </div>

                            <div>
                                <Text className={styles.settingLabelBlock}>{t("dashboard.admin.aiConfiguration.difficultyProgression")}</Text>
                                <Select<ProgressionMode>
                                    className={styles.fullWidthInput}
                                    value={difficultyProgression}
                                    onChange={setDifficultyProgression}
                                    options={[
                                        { label: t("dashboard.admin.aiConfiguration.progressionModeAdaptive"), value: "Adaptive (AI-driven)" },
                                        { label: t("dashboard.admin.aiConfiguration.progressionModeLinear"), value: "Linear (Strict sequence)" },
                                        { label: t("dashboard.admin.aiConfiguration.progressionModeCustom"), value: "Custom" },
                                    ]}
                                />
                            </div>

                            <div>
                                <div className={styles.settingHeader}>
                                    <Text className={styles.settingLabel}>{t("dashboard.admin.aiConfiguration.contentRecommendationWeight")}</Text>
                                    <Text className={styles.settingValue}>{recommendationWeight >= 70 ? t("dashboard.admin.aiConfiguration.high") : recommendationWeight >= 40 ? t("dashboard.admin.aiConfiguration.medium") : t("dashboard.admin.aiConfiguration.low")}</Text>
                                </div>
                                <Slider value={recommendationWeight} min={0} max={100} onChange={setRecommendationWeight} className={styles.slider} />
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card className={styles.sectionCard} title={t("dashboard.admin.aiConfiguration.difficultyAdjustment")}>
                        <Space direction="vertical" size={20} className={styles.settingsStack}>
                            <div className={styles.settingHeader}>
                                <Text className={styles.settingLabel}>{t("dashboard.admin.aiConfiguration.autoAdjustDifficulty")}</Text>
                                <Switch checked={autoAdjustDifficulty} onChange={setAutoAdjustDifficulty} />
                            </div>

                            <div>
                                <div className={styles.settingHeader}>
                                    <Text className={styles.settingLabel}>{t("dashboard.admin.aiConfiguration.adjustmentSensitivity")}</Text>
                                    <Text className={styles.settingValue}>{adjustmentSensitivity >= 70 ? t("dashboard.admin.aiConfiguration.high") : adjustmentSensitivity >= 40 ? t("dashboard.admin.aiConfiguration.medium") : t("dashboard.admin.aiConfiguration.low")}</Text>
                                </div>
                                <Slider
                                    value={adjustmentSensitivity}
                                    min={0}
                                    max={100}
                                    onChange={setAdjustmentSensitivity}
                                    disabled={!autoAdjustDifficulty}
                                    className={styles.slider}
                                />
                            </div>

                            <div>
                                <Text className={styles.settingLabelBlock}>{t("dashboard.admin.aiConfiguration.minQuestionsBeforeAdjustment")}</Text>
                                <InputNumber
                                    className={styles.fullWidthInput}
                                    min={1}
                                    max={30}
                                    value={minimumQuestionsBeforeAdjustment}
                                    onChange={(value) => setMinimumQuestionsBeforeAdjustment(typeof value === "number" ? value : 1)}
                                    disabled={!autoAdjustDifficulty}
                                />
                            </div>

                            <Row gutter={[12, 12]}>
                                <Col xs={24} sm={12}>
                                    <Text className={styles.settingLabelBlock}>{t("dashboard.admin.aiConfiguration.increaseThreshold")}</Text>
                                    <InputNumber
                                        className={styles.fullWidthInput}
                                        min={0}
                                        max={100}
                                        value={increaseThreshold}
                                        onChange={(value) => setIncreaseThreshold(typeof value === "number" ? value : 0)}
                                        disabled={!autoAdjustDifficulty}
                                    />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Text className={styles.settingLabelBlock}>{t("dashboard.admin.aiConfiguration.decreaseThreshold")}</Text>
                                    <InputNumber
                                        className={styles.fullWidthInput}
                                        min={0}
                                        max={100}
                                        value={decreaseThreshold}
                                        onChange={(value) => setDecreaseThreshold(typeof value === "number" ? value : 0)}
                                        disabled={!autoAdjustDifficulty}
                                    />
                                </Col>
                            </Row>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Button type="primary" className={styles.saveButton} onClick={handleSaveConfiguration}>
                {t("dashboard.admin.aiConfiguration.saveConfiguration")}
            </Button>

            <Modal
                title={t("dashboard.admin.aiConfiguration.createTemplate")}
                open={createModalOpen}
                onCancel={() => { setCreateModalOpen(false); form.resetFields(); }}
                onOk={() => form.submit()}
                okText={t("dashboard.admin.aiConfiguration.createTemplate")}
                confirmLoading={creating}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateTemplate}
                    initialValues={{ temperature: 0.7 }}
                >
                    <Form.Item
                        name="name"
                        label={t("dashboard.admin.aiConfiguration.templateName")}
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="purpose"
                        label={t("dashboard.admin.aiConfiguration.templatePurpose")}
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="templateText"
                        label={t("dashboard.admin.aiConfiguration.templateText")}
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
                    </Form.Item>
                    <Form.Item
                        name="temperature"
                        label={t("dashboard.admin.aiConfiguration.temperature")}
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={0} max={2} step={0.1} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

/** AI configuration page — wraps content with the AIPromptTemplateProvider. */
export default function AdminAiConfigurationPage() {
    return (
        <AIPromptTemplateProvider>
            <AiConfigurationContent />
        </AIPromptTemplateProvider>
    );
}
