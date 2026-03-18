"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function StudentDashboardPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.student.title")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
