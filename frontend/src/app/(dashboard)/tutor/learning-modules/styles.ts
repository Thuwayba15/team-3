"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    pageHeader: css`
        margin-bottom: ${token.marginLG}px;
    `,

    layout: css`
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: ${token.marginMD}px;
        align-items: flex-start;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,

    /* ── Left panel ── */
    libraryCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-head-title {
            font-weight: 600;
        }

        .ant-card-body {
            padding: ${token.paddingSM}px;
        }
    `,

    collapse: css`
        background: transparent;
        border: none;

        .ant-collapse-item {
            border: 1px solid ${token.colorBorderSecondary};
            border-radius: ${token.borderRadius}px !important;
            margin-bottom: ${token.marginXS}px;
            overflow: hidden;
        }

        .ant-collapse-header {
            font-weight: 500;
            font-size: 14px;
        }

        .ant-collapse-content {
            border-top: 1px solid ${token.colorBorderSecondary};
        }

        .ant-collapse-content-box {
            padding: ${token.paddingXS}px 0 !important;
        }
    `,

    moduleItem: css`
        display: flex;
        align-items: center;
        gap: ${token.marginXS}px;
        padding: 6px ${token.paddingMD}px;
        font-size: 13px;
        color: ${token.colorText};
        cursor: pointer;
        border-radius: ${token.borderRadiusSM}px;
        transition: background 0.15s;

        &:hover {
            background: ${token.colorFillAlter};
        }
    `,

    moduleIcon: css`
        color: ${token.colorPrimary};
        font-size: 14px;
    `,

    /* ── Right panel ── */
    formCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    formRow: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${token.marginMD}px;
        margin-bottom: ${token.marginMD}px;

        @media (max-width: 480px) {
            grid-template-columns: 1fr;
        }
    `,

    formField: css`
        margin-bottom: ${token.marginMD}px;
    `,

    fieldLabel: css`
        font-size: 13px;
        font-weight: 500;
        color: ${token.colorText};
        margin-bottom: 6px;
        display: block;
    `,

    difficultyGroup: css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: ${token.marginSM}px;

        .ant-radio-button-wrapper {
            text-align: center;
            border-radius: ${token.borderRadius}px !important;
            border-left-width: 1px !important;

            &::before {
                display: none;
            }
        }
    `,

    uploadDragger: css`
        border-radius: ${token.borderRadius}px;
    `,

    footer: css`
        display: flex;
        justify-content: flex-end;
        gap: ${token.marginSM}px;
        margin-top: ${token.marginLG}px;
        padding-top: ${token.paddingMD}px;
        border-top: 1px solid ${token.colorBorderSecondary};
    `,
}));
