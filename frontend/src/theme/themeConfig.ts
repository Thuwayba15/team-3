import type { ThemeConfig } from "antd";

/**
 * Centralised Ant Design theme configuration.
 */
const themeConfig: ThemeConfig = {
    token: {
        colorPrimary: "#131B4e",
        colorInfo: "#1e40af",
        colorSuccess: "#059669",
        colorWarning: "#d97706",
        colorError: "#dc2626",
        colorBgLayout: "#f8fafc",
        borderRadius: 8,
        fontFamily:
            "'Lexend', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        boxShadowSecondary: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        motionDurationSlow: "0.3s",
        motionDurationMid: "0.2s",
        motionDurationFast: "0.1s",
    },
    components: {
        Button: {
            borderRadius: 8,
            controlHeight: 40,
            boxShadow: "0 2px 4px rgba(19, 27, 78, 0.1)",
            boxShadowSecondary: "0 4px 8px rgba(19, 27, 78, 0.15)",
        },
        Input: {
            controlHeight: 40,
            borderRadius: 8,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            boxShadowSecondary: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        Card: {
            borderRadius: 12,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            boxShadowSecondary: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        Progress: {
            defaultColor: "#131B4e",
            boxShadow: "0 0 0 1px rgba(19, 27, 78, 0.1)",
        },
        Layout: {
            siderBg: "#131B4e",
            headerBg: "#ffffff",
            bodyBg: "#f8fafc",
        },
        Menu: {
            itemBg: "transparent",
            itemSelectedBg: "rgba(255, 255, 255, 0.1)",
            itemHoverBg: "rgba(255, 255, 255, 0.05)",
        },
        Select: {
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        },
        Dropdown: {
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        },
    },
};

export default themeConfig;
