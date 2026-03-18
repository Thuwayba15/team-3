"use client";

import {
    Button,
    Card,
    Col,
    Input,
    InputNumber,
    Row,
    Select,
    Slider,
    Space,
    Switch,
    Typography,
    message,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

type ProgressionMode = "Adaptive (AI-driven)" | "Linear (Strict sequence)" | "Custom";

interface IPromptTemplate {
    id: string;
    name: string;
    defaultContent: string;
}

interface IPromptTemplateState extends IPromptTemplate {
    content: string;
}

const PROMPT_TEMPLATES: IPromptTemplate[] = [
    {
        id: "general",
        name: "General Tutoring",
        defaultContent:
            "You are a helpful, encouraging tutor for South African students. Explain concepts simply and use local examples where appropriate. Always be supportive.",
    },
    {
        id: "math",
        name: "Mathematics Help",
        defaultContent:
            "When explaining math, break down the steps clearly. Do not just give the answer. Guide the student to solve it themselves by asking leading questions.",
    },
    {
        id: "science",
        name: "Science Explanation",
        defaultContent:
            "Use analogies to explain scientific concepts. Relate abstract ideas to everyday phenomena. Ensure safety is emphasized in any practical examples.",
    },
];

function buildTemplateState(): IPromptTemplateState[] {
    return PROMPT_TEMPLATES.map((template) => ({
        ...template,
        content: template.defaultContent,
    }));
}

/** AI configuration page for prompt templates and recommendation settings. */
export default function AdminAiConfigurationPage() {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();

    const [templates, setTemplates] = useState<IPromptTemplateState[]>(buildTemplateState);
    const [masteryThreshold, setMasteryThreshold] = useState(70);
    const [maxRetryAttempts, setMaxRetryAttempts] = useState(3);
    const [difficultyProgression, setDifficultyProgression] = useState<ProgressionMode>("Adaptive (AI-driven)");
    const [recommendationWeight, setRecommendationWeight] = useState(80);

    const [autoAdjustDifficulty, setAutoAdjustDifficulty] = useState(true);
    const [adjustmentSensitivity, setAdjustmentSensitivity] = useState(50);
    const [minimumQuestionsBeforeAdjustment, setMinimumQuestionsBeforeAdjustment] = useState(5);
    const [increaseThreshold, setIncreaseThreshold] = useState(80);
    const [decreaseThreshold, setDecreaseThreshold] = useState(40);

    const handleTemplateChange = (templateId: string, content: string): void => {
        setTemplates((previous) =>
            previous.map((template) =>
                template.id === templateId
                    ? {
                        ...template,
                        content,
                    }
                    : template
            )
        );
    };

    const handleTemplateReset = (templateId: string): void => {
        setTemplates((previous) =>
            previous.map((template) =>
                template.id === templateId
                    ? {
                        ...template,
                        content: template.defaultContent,
                    }
                    : template
            )
        );
    };

    const handleSaveConfiguration = (): void => {
        messageApi.success(t("dashboard.admin.aiConfiguration.saved"));
    };

    return (
        <div>
            {contextHolder}

            <PageHeader
                title={t("dashboard.admin.aiConfiguration.title")}
                subtitle={t("dashboard.admin.aiConfiguration.subtitle")}
            />

            <Card className={styles.sectionCard} title={t("dashboard.admin.aiConfiguration.promptTemplates")}>
                <Row gutter={[16, 16]}>
                    {templates.map((template) => (
                        <Col key={template.id} xs={24} lg={8}>
                            <Card className={styles.templateCard}>
                                <Title level={5} className={styles.templateTitle}>{template.name}</Title>
                                <Input.TextArea
                                    className={styles.templateTextArea}
                                    value={template.content}
                                    onChange={(event) => handleTemplateChange(template.id, event.target.value)}
                                    autoSize={{ minRows: 6, maxRows: 8 }}
                                />
                                <div className={styles.templateActions}>
                                    <Button type="text" className={styles.resetButton} onClick={() => handleTemplateReset(template.id)}>
                                        {t("dashboard.admin.aiConfiguration.resetToDefault")}
                                    </Button>
                                    <Button className={styles.editButton}>{t("common.edit")}</Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
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
        </div>
    );
}
