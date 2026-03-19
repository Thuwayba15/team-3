"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function StudentQuizzesPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.student.quizzesTitle")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
