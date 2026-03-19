"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    pageHeader: css`
        margin-bottom: ${token.marginLG}px;
    `,

    tabs: css`
        display: flex;
        gap: ${token.marginSM}px;
        margin-bottom: ${token.marginLG}px;
    `,

    tab: css`
        padding: 6px 18px;
        border-radius: 20px;
        border: 1px solid ${token.colorBorder};
        background: transparent;
        color: ${token.colorText};
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            border-color: #00b8a9;
            color: #00b8a9;
        }
    `,

    tabActive: css`
        background: #00b8a9 !important;
        border-color: #00b8a9 !important;
        color: #fff !important;
    `,

    alertList: css`
        display: flex;
        flex-direction: column;
        gap: ${token.marginMD}px;
    `,

    alertCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-body {
            padding: ${token.paddingMD}px ${token.paddingLG}px;
        }
    `,

    alertInner: css`
        display: flex;
        align-items: flex-start;
        gap: ${token.marginMD}px;
    `,

    alertIcon: css`
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 16px;
        margin-top: 2px;
    `,

    alertBody: css`
        flex: 1;
        min-width: 0;
    `,

    alertTitle: css`
        font-size: 15px;
        font-weight: 600;
        color: ${token.colorText};
        margin-bottom: 4px;
    `,

    alertActions: css`
        display: flex;
        gap: ${token.marginXS}px;
        margin-top: ${token.marginXS}px;
    `,

    actionLink: css`
        color: #00b8a9;
        font-size: 13px;
        padding: 0;
        height: auto;

        &:hover {
            color: #00a89a !important;
        }
    `,

    dismissLink: css`
        color: ${token.colorTextSecondary};
        font-size: 13px;
        padding: 0;
        height: auto;

        &:hover {
            color: ${token.colorText} !important;
        }
    `,

    alertWhen: css`
        font-size: 12px;
        white-space: nowrap;
        flex-shrink: 0;
        margin-top: 4px;
    `,
}));
