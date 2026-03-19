"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function TutorInterventionsPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.tutor.interventionsTitle")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
