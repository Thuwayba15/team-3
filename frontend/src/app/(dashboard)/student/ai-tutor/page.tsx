"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function StudentAiTutorPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.student.aiTutorTitle")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
