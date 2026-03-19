"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function TutorLearningModulesPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.tutor.learningModulesTitle")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
