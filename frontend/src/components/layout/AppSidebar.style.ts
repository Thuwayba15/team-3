import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    sidebar: css`
        background: ${token.colorPrimary} !important;
        border-right: 1px solid ${token.colorPrimaryBorder};
        box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;

        .ant-layout-sider-children {
            display: flex;
            flex-direction: column;
            min-height: 100%;
        }
    `,

    mobileSidebar: css`
        background: ${token.colorPrimary};
        min-height: 100%;
        display: flex;
        flex-direction: column;
    `,

    mobileHeader: css`
        padding: ${token.paddingSM}px;
        display: flex;
        justify-content: flex-end;
    `,

    mobileMenuButton: css`
        color: ${token.colorTextLightSolid};
        border: none;
    `,

    logoSection: css`
        padding: ${token.paddingLG}px ${token.paddingMD}px;
        text-align: center;
        border-bottom: 1px solid ${token.colorPrimaryBorder};
    `,

    logoImage: css`
        width: 80px;
        height: 80px;
        border-radius: ${token.borderRadiusLG}px;
        margin-bottom: ${token.marginSM}px;
        animation: logoSpin 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        
        @keyframes logoSpin {
            0% {
                transform: rotate(0deg) scale(0.8);
                opacity: 0;
            }
            100% {
                transform: rotate(360deg) scale(1);
                opacity: 1;
            }
        }
    `,

    brandTitle: css`
        color: ${token.colorTextLightSolid} !important;
        margin: 0 !important;
        font-size: 18px !important;
        font-weight: 600 !important;
        font-family: 'Lexend', sans-serif;
    `,

    languageSection: css`
        padding: ${token.paddingMD}px;
        border-bottom: 1px solid ${token.colorPrimaryBorder};
    `,

    languageSelect: css`
        width: 100%;

        .ant-select-selector {
            background: ${token.colorPrimaryHover} !important;
            border: 1px solid ${token.colorPrimaryBorder} !important;
            color: ${token.colorTextLightSolid} !important;
        }

        .ant-select-arrow {
            color: ${token.colorTextLightSolid};
        }
    `,

    menu: css`
        background: transparent;
        border-inline-end: none !important;
        flex: 1;
        padding: ${token.paddingSM}px 0;

        .ant-menu-item {
            margin-inline: ${token.marginXS}px;
            margin-block: 6px;
            color: ${token.colorTextLightSolid};
            border-radius: ${token.borderRadius}px;
            transition: all 0.3s ease;
        }

        .ant-menu-item:hover {
            color: ${token.colorTextLightSolid};
            background: rgba(255, 255, 255, 0.15);
        }

        .ant-menu-item-selected {
            color: ${token.colorTextLightSolid};
            background: rgba(255, 255, 255, 0.2);
            font-weight: 600;
        }

        .ant-menu-item-selected:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `,

    userSection: css`
        padding: ${token.paddingMD}px;
        border-top: 1px solid ${token.colorPrimaryBorder};
        margin-top: auto;
    `,

    userWrap: css`
        background: none;
        border: none;
        color: ${token.colorTextLightSolid};
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        padding: ${token.paddingXS}px;
        border-radius: ${token.borderRadius}px;
        cursor: pointer;
        width: 100%;
        text-align: left;

        &:hover {
            background: ${token.colorPrimaryHover};
        }
    `,

    userAvatar: css`
        background: ${token.colorInfo} !important;
        border: 2px solid ${token.colorTextLightSolid};
    `,

    userName: css`
        color: ${token.colorTextLightSolid};
        font-size: 14px;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,

    profileDropdown: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: ${token.borderRadiusLG}px;
        padding: ${token.paddingSM}px;
        min-width: 200px;
        box-shadow: ${token.boxShadowSecondary};
    `,

    profileRow: css`
        display: flex;
        justify-content: space-between;
        margin-bottom: ${token.marginXS}px;

        &:last-child {
            margin-bottom: 0;
        }
    `,

    profileLabel: css`
        color: ${token.colorTextSecondary};
        font-size: 12px;
    `,

    profileValue: css`
        color: ${token.colorText};
        font-size: 12px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 120px;
    `,

    logoutButton: css`
        color: ${token.colorTextLightSolid} !important;
        padding: ${token.paddingXS}px 0 !important;
        height: auto !important;
        font-size: 14px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: ${token.marginXS}px !important;
        margin-top: ${token.marginSM}px !important;

        &:hover {
            color: ${token.colorError} !important;
            background: transparent !important;
        }
    `,
}));
