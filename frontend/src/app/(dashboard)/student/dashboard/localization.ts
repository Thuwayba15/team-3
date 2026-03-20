import type { TFunction } from "i18next";

export const getLocalizedGuidanceMessage = (overallScore: number, t: TFunction): string => {
    if (overallScore >= 80) {
        return t("dashboard.student.dashboardPage.motivationalMessages.excellent");
    }

    if (overallScore >= 60) {
        return t("dashboard.student.dashboardPage.motivationalMessages.good");
    }

    if (overallScore >= 40) {
        return t("dashboard.student.dashboardPage.motivationalMessages.progress");
    }

    return t("dashboard.student.dashboardPage.motivationalMessages.beginner");
};

export const getLocalizedAttentionAction = (
    masteryPercent: number,
    backendAdvice: string,
    t: TFunction,
    isEnglishLanguage: boolean
): string => {
    if (isEnglishLanguage && backendAdvice.trim().length > 0) {
        return backendAdvice;
    }

    if (masteryPercent < 40) {
        return t("dashboard.student.dashboardPage.attentionActions.critical");
    }

    if (masteryPercent < 60) {
        return t("dashboard.student.dashboardPage.attentionActions.weak");
    }

    return t("dashboard.student.dashboardPage.attentionActions.revision");
};
