import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    sidebar: css`
        background: #0d5b54 !important;
        border-right: 1px solid rgba(255, 255, 255, 0.12);
    `,

    menu: css`
        background: transparent;
        border-inline-end: none !important;
        padding-top: ${token.paddingSM}px;

        .ant-menu-item {
            margin-inline: ${token.marginXS}px;
            margin-block: 6px;
            color: rgba(255, 255, 255, 0.92);
            border-radius: ${token.borderRadius}px;
        }

        .ant-menu-item:hover,
        .ant-menu-item-active {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.15);
        }

        .ant-menu-item-selected {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.24);
        }
    `,
}));
