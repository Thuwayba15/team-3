"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    pageHeader: css`
        margin-bottom: ${token.marginLG}px;
    `,

    statsRow: css`
        margin-bottom: ${token.marginLG}px;
    `,

    statCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-body {
            padding: ${token.paddingLG}px;
        }
    `,

    statIcon: css`
        font-size: 22px;
        margin-bottom: ${token.marginSM}px;
    `,

    statValue: css`
        font-size: 28px;
        font-weight: 700;
        color: ${token.colorTextHeading};
        line-height: 1.2;
        margin-bottom: 4px;
    `,

    statLabel: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
    `,

    /* ── Heatmap ───────────────────────────────────────────── */
    sectionCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-bottom: ${token.marginLG}px;

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    sectionSubtitle: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        margin-bottom: ${token.marginMD}px;
        margin-top: -${token.marginSM}px;
    `,

    heatmapGrid: css`
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;

        @media (max-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 480px) {
            grid-template-columns: repeat(1, 1fr);
        }
    `,

    heatmapTile: css`
        border-radius: ${token.borderRadius}px;
        padding: 28px 16px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        min-height: 120px;
        gap: 8px;
    `,

    heatmapPercent: css`
        font-size: 22px;
        font-weight: 700;
        color: #fff;
    `,

    heatmapLabel: css`
        font-size: 12px;
        color: rgba(255, 255, 255, 0.85);
        text-align: center;
    `,

    /* ── Performance chart placeholder ────────────────────── */
    chartPlaceholder: css`
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${token.borderRadius}px;
        background: ${token.colorFillQuaternary};
        color: ${token.colorTextTertiary};
        font-size: 14px;
    `,

    /* ── Bottom two-column section ─────────────────────────── */
    bottomRow: css`
        margin-bottom: ${token.marginLG}px;
    `,

    listCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        height: 100%;

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    lessonItem: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid ${token.colorBorderSecondary};

        &:last-child {
            border-bottom: none;
        }
    `,

    lessonInfo: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,

    lessonTitle: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
    `,

    lessonTime: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    lessonScore: css`
        font-size: 14px;
        font-weight: 700;
        color: #00b8a9;
    `,

    quizItem: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid ${token.colorBorderSecondary};

        &:last-child {
            border-bottom: none;
        }
    `,

    quizInfo: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,

    quizTitle: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
    `,

    quizMeta: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    /* ── Attention card ────────────────────────────────────── */
    attentionCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid #ffe58f;
        background: #fffbe6;

        .ant-card-head {
            background: transparent;
            border-bottom: 1px solid #ffe58f;
        }

        .ant-card-head-title {
            font-weight: 600;
            color: #ad6800;
        }
    `,

    attentionItem: css`
        padding: 10px 0;
        border-bottom: 1px solid #ffd666;

        &:last-child {
            border-bottom: none;
        }
    `,

    attentionTitle: css`
        font-size: 14px;
        font-weight: 600;
        color: #ad6800;
        display: block;
        margin-bottom: 2px;
    `,

    attentionDesc: css`
        font-size: 13px;
        color: #875800;
    `,
}));
