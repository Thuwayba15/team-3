"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function StudentProgressPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.student.progressTitle")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
