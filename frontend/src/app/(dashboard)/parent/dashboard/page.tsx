"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function ParentDashboardPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.parent.title")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
