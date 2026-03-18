"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function ParentChildProgressPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.parent.childProgressTitle")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
