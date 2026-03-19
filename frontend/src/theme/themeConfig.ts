import type { ThemeConfig } from "antd";

/**
 * Centralised Ant Design theme configuration.
 */
const themeConfig: ThemeConfig = {
    token: {
        colorPrimary: "#0f766e",
        colorInfo: "#1d4ed8",
        colorSuccess: "#15803d",
        colorWarning: "#b45309",
        colorError: "#b91c1c",
        colorBgLayout: "#f5f5f5",
        borderRadius: 8,
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    components: {
        Button: {
            borderRadius: 8,
            controlHeight: 40,
        },
        Input: {
            controlHeight: 40,
            borderRadius: 8,
        },
        Card: {
            borderRadius: 12,
        },
        Progress: {
            defaultColor: "#0f766e",
        },
    },
};

export default themeConfig;
