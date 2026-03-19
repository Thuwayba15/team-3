"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function AdminAnalyticsPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.admin.analyticsTitle")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
