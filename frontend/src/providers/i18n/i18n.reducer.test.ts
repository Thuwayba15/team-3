import { describe, expect, it } from "vitest";

import { I18nActionType, setLanguage, setLoading } from "./actions";
import { INITIAL_STATE } from "./context";
import { i18nReducer } from "./reducer";

describe("i18nReducer", () => {
    it("updates loading state", () => {
        const result = i18nReducer(INITIAL_STATE, setLoading(true));

        expect(result.isLoading).toBe(true);
        expect(result.currentLanguage).toBe("en");
    });

    it("updates current language", () => {
        const result = i18nReducer(INITIAL_STATE, setLanguage("zu"));

        expect(result.currentLanguage).toBe("zu");
        expect(result.isLoading).toBe(false);
    });

    it("returns existing state for unknown action", () => {
        const unknownAction = {
            type: "UNKNOWN_ACTION",
            payload: "st",
        } as unknown as { type: I18nActionType; payload: string };

        const result = i18nReducer(INITIAL_STATE, unknownAction);

        expect(result).toEqual(INITIAL_STATE);
    });
});
