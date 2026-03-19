"use client";

import { Alert, Button, Card, Select, Spin, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { userProfileService, type IPlatformLanguageOption } from "@/services/users/userProfileService";

const { Title, Text } = Typography;

export default function StudentSettingsPage() {
    const [languages, setLanguages] = useState<IPlatformLanguageOption[]>([]);
    const [preferredLanguage, setPreferredLanguage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            userProfileService.getActiveLanguages(),
            userProfileService.getMyProfile(),
        ])
            .then(([languageOptions, profile]) => {
                setLanguages(languageOptions);
                setPreferredLanguage(profile.preferredLanguage);
                setError(null);
            })
            .catch(() => setError("Could not load language preferences."))
            .finally(() => setLoading(false));
    }, []);

    const savePreference = async () => {
        setSaving(true);
        try {
            await userProfileService.updateMyPlatformLanguage(preferredLanguage);
            message.success("Preferred language updated.");
        } catch {
            message.error("Could not update preferred language.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <Title level={2}>Language</Title>
            <Text type="secondary">Choose the language used for your translated lesson content and tutor support.</Text>

            {error && <Alert type="error" message={error} style={{ marginTop: 16 }} />}

            <Spin spinning={loading}>
                <Card style={{ marginTop: 16, maxWidth: 540 }}>
                    <Text strong>Preferred Language</Text>
                    <Select
                        style={{ width: "100%", marginTop: 12, marginBottom: 16 }}
                        value={preferredLanguage}
                        onChange={setPreferredLanguage}
                        options={languages.map((language) => ({ value: language.code, label: language.name }))}
                    />
                    <Button type="primary" loading={saving} onClick={() => void savePreference()}>
                        Save Language Preference
                    </Button>
                </Card>
            </Spin>
        </div>
    );
}
