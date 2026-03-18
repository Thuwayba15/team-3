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
        messageApi.success("AI configuration saved. Backend integration can now persist these values.");
    };

    return (
        <div>
            {contextHolder}

            <PageHeader
                title="AI Configuration"
                subtitle="Manage AI tutor prompts and recommendation engine settings"
            />

            <Card className={styles.sectionCard} title="Tutoring Prompt Templates">
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
                                        Reset to Default
                                    </Button>
                                    <Button className={styles.editButton}>Edit</Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>

            <Row gutter={[16, 16]} className={styles.settingsRow}>
                <Col xs={24} lg={12}>
                    <Card className={styles.sectionCard} title="Recommendation Engine Settings">
                        <Space direction="vertical" size={20} className={styles.settingsStack}>
                            <div>
                                <div className={styles.settingHeader}>
                                    <Text className={styles.settingLabel}>Minimum Mastery Threshold</Text>
                                    <Text className={styles.settingValue}>{masteryThreshold}%</Text>
                                </div>
                                <Slider value={masteryThreshold} min={0} max={100} onChange={setMasteryThreshold} className={styles.slider} />
                            </div>

                            <div>
                                <Text className={styles.settingLabelBlock}>Maximum Retry Attempts</Text>
                                <InputNumber
                                    className={styles.fullWidthInput}
                                    min={1}
                                    max={10}
                                    value={maxRetryAttempts}
                                    onChange={(value) => setMaxRetryAttempts(typeof value === "number" ? value : 1)}
                                />
                            </div>

                            <div>
                                <Text className={styles.settingLabelBlock}>Difficulty Progression</Text>
                                <Select<ProgressionMode>
                                    className={styles.fullWidthInput}
                                    value={difficultyProgression}
                                    onChange={setDifficultyProgression}
                                    options={[
                                        { label: "Adaptive (AI-driven)", value: "Adaptive (AI-driven)" },
                                        { label: "Linear (Strict sequence)", value: "Linear (Strict sequence)" },
                                        { label: "Custom", value: "Custom" },
                                    ]}
                                />
                            </div>

                            <div>
                                <div className={styles.settingHeader}>
                                    <Text className={styles.settingLabel}>Content Recommendation Weight</Text>
                                    <Text className={styles.settingValue}>{recommendationWeight >= 70 ? "High" : recommendationWeight >= 40 ? "Medium" : "Low"}</Text>
                                </div>
                                <Slider value={recommendationWeight} min={0} max={100} onChange={setRecommendationWeight} className={styles.slider} />
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card className={styles.sectionCard} title="Difficulty Adjustment">
                        <Space direction="vertical" size={20} className={styles.settingsStack}>
                            <div className={styles.settingHeader}>
                                <Text className={styles.settingLabel}>Auto-adjust Difficulty</Text>
                                <Switch checked={autoAdjustDifficulty} onChange={setAutoAdjustDifficulty} />
                            </div>

                            <div>
                                <div className={styles.settingHeader}>
                                    <Text className={styles.settingLabel}>Adjustment Sensitivity</Text>
                                    <Text className={styles.settingValue}>{adjustmentSensitivity >= 70 ? "High" : adjustmentSensitivity >= 40 ? "Medium" : "Low"}</Text>
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
                                <Text className={styles.settingLabelBlock}>Min. Questions Before Adjustment</Text>
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
                                    <Text className={styles.settingLabelBlock}>Increase Threshold (%)</Text>
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
                                    <Text className={styles.settingLabelBlock}>Decrease Threshold (%)</Text>
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
                Save Configuration
            </Button>
        </div>
    );
}
