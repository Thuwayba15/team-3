"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "react-i18next";

export default function TutorStudentsPage() {
    const { t } = useTranslation();

    return <PageHeader title={t("dashboard.tutor.studentsTitle")} subtitle={t("dashboard.scaffoldSubtitle")} />;
}
