import { describe, expect, it } from "vitest";
import type { TFunction } from "i18next";
import { getLocalizedAttentionAction, getLocalizedGuidanceMessage } from "./localization";

const t = ((key: string): string => key) as TFunction;

describe("dashboard localization helpers", () => {
    it("uses backend advice for English when advice is present", () => {
        const result = getLocalizedAttentionAction(22, "Review this topic tonight.", t, true);

        expect(result).toBe("Review this topic tonight.");
    });

    it("uses localized critical message for non-English when mastery is below 40", () => {
        const result = getLocalizedAttentionAction(35, "English backend advice", t, false);

        expect(result).toBe("dashboard.student.dashboardPage.attentionActions.critical");
    });

    it("uses localized weak message for non-English when mastery is between 40 and 59", () => {
        const result = getLocalizedAttentionAction(55, "English backend advice", t, false);

        expect(result).toBe("dashboard.student.dashboardPage.attentionActions.weak");
    });

    it("uses localized revision message for non-English when mastery is 60 or above", () => {
        const result = getLocalizedAttentionAction(72, "English backend advice", t, false);

        expect(result).toBe("dashboard.student.dashboardPage.attentionActions.revision");
    });

    it("maps high score to excellent guidance key", () => {
        const result = getLocalizedGuidanceMessage(84, t);

        expect(result).toBe("dashboard.student.dashboardPage.motivationalMessages.excellent");
    });

    it("maps low score to beginner guidance key", () => {
        const result = getLocalizedGuidanceMessage(21, t);

        expect(result).toBe("dashboard.student.dashboardPage.motivationalMessages.beginner");
    });
});
