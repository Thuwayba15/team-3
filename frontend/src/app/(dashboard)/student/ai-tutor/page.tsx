"use client";

import { Button, Card, Typography } from "antd";
import { useState } from "react";
import AiTutorDrawer from "@/components/AiTutorDrawer";

const { Title, Text } = Typography;

export default function StudentAiTutorPage() {
    const [open, setOpen] = useState(true);

    return (
        <div>
            <Title level={2}>Ask AI</Title>
            <Text type="secondary">Open the AI tutor with your current Life Sciences context and preferred response language.</Text>

            <Card style={{ marginTop: 16 }}>
                <Text>The AI tutor stays in the frontend app and uses the admin-configured prompts plus your lesson context.</Text>
                <div style={{ marginTop: 16 }}>
                    <Button type="primary" onClick={() => setOpen(true)}>
                        Open AI Tutor
                    </Button>
                </div>
            </Card>

            <AiTutorDrawer
                open={open}
                onClose={() => setOpen(false)}
                subjectName="Life Sciences"
                topicName="Current Topic"
            />
        </div>
    );
}
