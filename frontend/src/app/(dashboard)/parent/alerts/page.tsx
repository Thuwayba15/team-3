"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function ParentAlertsPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.parent.alertsTitle")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
