"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function TutorAnalyticsPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.tutor.analyticsTitle")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
