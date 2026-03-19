"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function StudentSettingsPage() {
    const { t } = useTranslation();

    return (
        <PageHeader
            title={t("settings.studentTitle")}
            subtitle={t("settings.studentSubtitle")}
        />
    );
}
