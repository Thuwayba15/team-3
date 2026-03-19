"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function TutorDashboardPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.tutor.title")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
