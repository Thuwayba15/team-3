"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function StudentLearningPathPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.student.learningPathTitle")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
