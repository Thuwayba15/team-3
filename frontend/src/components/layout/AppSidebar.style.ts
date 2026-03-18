import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    sidebar: css`
        background: ${token.colorPrimary} !important;
        border-right: 1px solid ${token.colorPrimaryBorder};
        display: flex;
        flex-direction: column;

        .ant-layout-sider-children {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
    `,

    mobileSidebar: css`
        background: ${token.colorPrimary};
        min-height: 100%;
        display: flex;
        flex-direction: column;
    `,

    roleLabel: css`
        padding: ${token.paddingMD}px ${token.paddingMD}px ${token.paddingSM}px;
    `,

    roleLabelText: css`
        color: ${token.colorTextLightSolid};
        opacity: 0.72;
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
            color: ${token.colorTextLightSolid};
            border-radius: ${token.borderRadius}px;
        }

        .ant-menu-item:hover,
        .ant-menu-item-active {
            color: ${token.colorTextLightSolid};
            background: ${token.colorPrimaryHover};
        }

        .ant-menu-item-selected {
            color: ${token.colorTextLightSolid};
            background: ${token.colorPrimaryActive};
        }
    `,

    helpSection: css`
        margin: ${token.marginMD}px;
        padding: ${token.paddingMD}px;
        background: ${token.colorPrimaryHover};
        border-radius: ${token.borderRadiusLG}px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,

    helpIcon: css`
        font-size: 18px;
        color: ${token.colorTextLightSolid};
        opacity: 0.85;
        margin-bottom: 2px;
    `,

    helpTitle: css`
        color: ${token.colorTextLightSolid};
        font-size: 13px;
        display: block;
    `,

    helpSubtitle: css`
        color: ${token.colorTextLightSolid};
        opacity: 0.72;
        font-size: 12px;
        display: block;
        margin-bottom: 6px;
    `,

    helpButton: css`
        background: ${token.colorInfo};
        border: none;
        color: ${token.colorTextLightSolid};
        font-weight: 500;

        &:hover {
            background: ${token.colorInfoHover} !important;
            color: ${token.colorTextLightSolid} !important;
        }
    `,
}));
