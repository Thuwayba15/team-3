import type { ThemeConfig } from "antd";

/**
 * Centralised Ant Design theme configuration.
 */
const themeConfig: ThemeConfig = {
    token: {
        colorPrimary: "#0f766e",
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
    },
};

export default themeConfig;
