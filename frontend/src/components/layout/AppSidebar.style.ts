import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    sidebar: css`
        background: #0d5b54 !important;
        border-right: 1px solid rgba(255, 255, 255, 0.12);
        display: flex;
        flex-direction: column;

        .ant-layout-sider-children {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
    `,

    roleLabel: css`
        padding: ${token.paddingMD}px ${token.paddingMD}px ${token.paddingSM}px;
    `,

    roleLabelText: css`
        color: rgba(255, 255, 255, 0.55);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    `,

    menu: css`
        background: transparent;
        border-inline-end: none !important;
        flex: 1;

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

    helpSection: css`
        margin: ${token.marginMD}px;
        padding: ${token.paddingMD}px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: ${token.borderRadiusLG}px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,

    helpIcon: css`
        font-size: 18px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 2px;
    `,

    helpTitle: css`
        color: #ffffff;
        font-size: 13px;
        display: block;
    `,

    helpSubtitle: css`
        color: rgba(255, 255, 255, 0.55);
        font-size: 12px;
        display: block;
        margin-bottom: 6px;
    `,

    helpButton: css`
        background: #00b8a9;
        border: none;
        color: #ffffff;
        font-weight: 500;

        &:hover {
            background: #00a89a !important;
            color: #ffffff !important;
        }
    `,
}));
