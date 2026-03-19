"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    description: css`
        margin-bottom: ${token.marginMD}px;
        color: ${token.colorTextSecondary};
    `,

    list: css`
        display: flex;
        flex-direction: column;
        gap: ${token.marginSM}px;
        max-height: 360px;
        overflow-y: auto;
        padding-right: ${token.paddingXS}px;
    `,

    card: css`
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadiusLG}px;
        padding: ${token.paddingMD}px;
        transition: all 0.2s;
        cursor: pointer;

        &:hover {
            border-color: ${token.colorPrimary};
        }
    `,

    cardSelected: css`
        border-color: ${token.colorPrimary} !important;
        background: ${token.colorPrimaryBg};
    `,

    cardDisabled: css`
        cursor: not-allowed;
        background: ${token.colorFillQuaternary};
        opacity: 0.8;
    `,

    cardHeader: css`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: ${token.marginSM}px;
    `,

    titleWrap: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,

    grade: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    descriptionText: css`
        display: block;
        margin-top: ${token.marginSM}px;
        color: ${token.colorTextSecondary};
    `,

    footer: css`
        display: flex;
        justify-content: flex-end;
        gap: ${token.marginSM}px;
        padding-top: ${token.paddingSM}px;
    `,
}));
