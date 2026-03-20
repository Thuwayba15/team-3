"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    loadingState: css`
        width: 100%;
        min-height: 320px;
    `,

    errorState: css`
        margin-top: ${token.marginLG}px;
    `,

    emptyState: css`
        min-height: 320px;
        display: flex;
        align-items: center;
        justify-content: center;
    `,

    fullWidth: css`
        width: 100%;
    `,

    welcomeSection: css`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: ${token.marginMD}px;
        margin-bottom: ${token.marginLG}px;
    `,

    welcomeText: css`
        margin-bottom: 0 !important;
    `,

    askAiBtn: css`
        background: #1e40af !important;
        border-color: #1e40af !important;
        display: flex;
        align-items: center;
        gap: 6px;

        &:hover {
            background: #1d4ed8 !important;
            border-color: #1d4ed8 !important;
        }
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

    statHeaderRow: css`
        display: flex;
        align-items: center;
        margin-bottom: ${token.marginSM}px;
    `,

    statIcon: css`
        font-size: 22px;
        color: #1e40af;
    `,

    statValue: css`
        font-size: 32px;
        font-weight: 700;
        color: ${token.colorTextHeading};
        line-height: 1.2;
        margin-bottom: 4px;
    `,

    statLabel: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
    `,

    nextLessonCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-bottom: ${token.marginLG}px;

        .ant-card-head {
            border-bottom: 1px solid ${token.colorBorderSecondary};
        }

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    nextLessonSubtitle: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
    `,

    nextLessonBody: css`
        display: flex;
        align-items: center;
        gap: ${token.marginLG}px;
    `,

    lessonThumbnail: css`
        width: 80px;
        height: 80px;
        border-radius: ${token.borderRadius}px;
        background: ${token.colorFillSecondary};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 28px;
        color: ${token.colorTextTertiary};
    `,

    lessonInfo: css`
        flex: 1;
    `,

    lessonTitle: css`
        font-size: 16px;
        font-weight: 600;
        color: ${token.colorTextHeading};
        margin-bottom: 6px;
        display: block;
    `,

    lessonDesc: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        display: block;
        margin-bottom: ${token.marginMD}px;
    `,

    lessonActions: css`
        display: flex;
        align-items: center;
        gap: ${token.marginMD}px;
    `,

    startBtn: css`
        background: #1e40af !important;
        border-color: #1e40af !important;

        &:hover {
            background: #1d4ed8 !important;
            border-color: #1d4ed8 !important;
        }
    `,

    durationText: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        display: flex;
        align-items: center;
        gap: 4px;
    `,

    heatmapCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    heatmapSubtitle: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
    `,

    heatmapGrid: css`
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;

        @media (max-width: 1024px) {
            grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 480px) {
            grid-template-columns: repeat(1, 1fr);
        }
    `,

    heatmapPagination: css`
        margin-top: ${token.marginMD}px;
        display: flex;
        justify-content: flex-end;
    `,

    heatmapTile: css`
        border-radius: ${token.borderRadius}px;
        padding: 20px 12px 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        min-height: 120px;
        gap: 6px;
    `,

    heatmapTopic: css`
        font-size: 12px;
        color: rgba(255, 255, 255, 0.92);
        text-align: center;
    `,

    heatmapPercent: css`
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
    `,

    heatmapSubject: css`
        font-size: 12px;
        color: rgba(255, 255, 255, 0.84);
        text-align: center;
    `,

    heatStrongTile: css`
        background: #059669;
    `,

    heatModerateTile: css`
        background: #d97706;
    `,

    heatWeakTile: css`
        background: #f59e0b;
    `,

    heatCriticalTile: css`
        background: #dc2626;
    `,

    attentionCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid #d97706;
        background: #fef3c7;
        margin-bottom: ${token.marginLG}px;

        .ant-card-head {
            background: transparent;
            border-bottom: 1px solid #d97706;
        }

        .ant-card-head-title {
            font-weight: 600;
            color: #92400e;
        }
    `,

    attentionList: css`
        width: 100%;
    `,

    attentionPagination: css`
        margin-top: ${token.marginMD}px;
        display: flex;
        justify-content: flex-end;
    `,

    attentionItem: css`
        padding: ${token.paddingSM}px;
        border-radius: ${token.borderRadius}px;
        border: 1px solid #d97706;
        background: #fef3c7;
    `,

    attentionHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${token.marginSM}px;
    `,

    attentionTitle: css`
        font-size: 14px;
        font-weight: 600;
        color: #92400e;
    `,

    attentionPercent: css`
        font-size: 13px;
        font-weight: 600;
        color: #92400e;
    `,

    attentionMeta: css`
        display: block;
        color: #92400e;
        font-size: 12px;
        margin-top: 4px;
    `,

    attentionDesc: css`
        display: block;
        color: #78350f;
        font-size: 13px;
        margin-top: 6px;
    `,

    guidanceCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-bottom: ${token.marginLG}px;
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    `,

    guidanceIcon: css`
        color: #1e40af;
        font-size: 18px;
        margin-top: 2px;
    `,

    guidanceTitle: css`
        display: block;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 4px;
    `,

    guidanceText: css`
        display: block;
        font-size: 13px;
        color: ${token.colorTextSecondary};
    `,

    completedCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
    `,

    completedRow: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
    `,

    completedIcon: css`
        color: #059669;
        font-size: 16px;
    `,
}));
