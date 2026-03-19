"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    pageHeader: css`
        margin-bottom: ${token.marginLG}px;
    `,

    layout: css`
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: ${token.marginMD}px;
        align-items: flex-start;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,

    /* ── Left panel ── */
    listCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 2px solid ${token.colorError};

        .ant-card-head {
            border-bottom: 1px solid ${token.colorBorderSecondary};
        }

        .ant-card-head-title {
            font-weight: 600;
            font-size: 14px;
        }

        .ant-card-body {
            padding: ${token.paddingSM}px;
        }
    `,

    studentRow: css`
        padding: ${token.paddingSM}px ${token.paddingMD}px;
        border-radius: ${token.borderRadius}px;
        cursor: pointer;
        transition: background 0.15s;

        &:hover {
            background: ${token.colorFillAlter};
        }
    `,

    studentRowSelected: css`
        background: ${token.colorPrimaryBg};

        &:hover {
            background: ${token.colorPrimaryBg};
        }
    `,

    studentRowHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2px;
    `,

    studentRowName: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
    `,

    studentRowDesc: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    /* ── Right panel ── */
    detailCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-body {
            padding: ${token.paddingLG}px;
        }
    `,

    detailHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: ${token.marginLG}px;
        flex-wrap: wrap;
        gap: ${token.marginSM}px;
    `,

    detailHeaderLeft: css`
        display: flex;
        align-items: center;
        gap: ${token.marginMD}px;
    `,

    detailName: css`
        font-size: 18px;
        font-weight: 600;
        color: ${token.colorText};
        margin-bottom: 2px;
    `,

    detailMeta: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
    `,

    sectionLabel: css`
        font-size: 13px;
        font-weight: 600;
        color: ${token.colorText};
        margin-bottom: ${token.marginSM}px;
    `,

    alertBox: css`
        background: ${token.colorErrorBg};
        border: 1px solid ${token.colorErrorBorder};
        border-radius: ${token.borderRadius}px;
        padding: ${token.paddingMD}px;
        display: flex;
        gap: ${token.marginSM}px;
        align-items: flex-start;
        margin-bottom: ${token.marginLG}px;
        font-size: 13px;
        color: ${token.colorText};
        line-height: 1.6;
    `,

    alertIcon: css`
        color: ${token.colorError};
        font-size: 16px;
        flex-shrink: 0;
        margin-top: 2px;
    `,

    actionsGrid: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${token.marginSM}px;
        margin-bottom: ${token.marginLG}px;

        @media (max-width: 480px) {
            grid-template-columns: 1fr;
        }
    `,

    actionCard: css`
        border-radius: ${token.borderRadius}px;
        border: 1px solid ${token.colorBorderSecondary};
        padding: ${token.paddingMD}px;
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        cursor: pointer;
        transition: background 0.15s;

        &:hover {
            background: ${token.colorFillAlter};
        }
    `,

    actionCardPrimary: css`
        background: ${token.colorPrimaryBg};
        border-color: ${token.colorPrimaryBorder};

        &:hover {
            background: ${token.colorPrimaryBgHover};
        }
    `,

    actionIcon: css`
        font-size: 20px;
        color: ${token.colorPrimary};
        flex-shrink: 0;
    `,

    actionTitle: css`
        font-size: 13px;
        font-weight: 600;
        color: ${token.colorText};
        display: block;
    `,

    actionDesc: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        display: block;
    `,

    notesSection: css`
        margin-bottom: ${token.marginLG}px;
    `,

    footer: css`
        display: flex;
        justify-content: flex-end;
    `,
}));
