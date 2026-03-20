"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    loadingState: css`
        min-height: 320px;
        display: flex;
        align-items: center;
        justify-content: center;
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
        background: #00b8a9 !important;
        border-color: #00b8a9 !important;
        display: flex;
        align-items: center;
        gap: 6px;

        &:hover {
            background: #00a89a !important;
            border-color: #00a89a !important;
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
        color: #00b8a9;
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
        background: #00b8a9 !important;
        border-color: #00b8a9 !important;

        &:hover {
            background: #00a89a !important;
            border-color: #00a89a !important;
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
        background: #00b8a9;
    `,

    heatModerateTile: css`
        background: #7cb305;
    `,

    heatWeakTile: css`
        background: #faad14;
    `,

    heatCriticalTile: css`
        background: #ff7875;
    `,

    attentionCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid #ffe58f;
        background: #fffbe6;
        margin-bottom: ${token.marginLG}px;

        .ant-card-head {
            background: transparent;
            border-bottom: 1px solid #ffe58f;
        }

        .ant-card-head-title {
            font-weight: 600;
            color: #ad6800;
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
        border: 1px solid #ffe58f;
        background: #fff7e6;
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
        color: #ad6800;
    `,

    attentionPercent: css`
        font-size: 13px;
        font-weight: 600;
        color: #ad6800;
    `,

    attentionMeta: css`
        display: block;
        color: #ad6800;
        font-size: 12px;
        margin-top: 4px;
    `,

    attentionDesc: css`
        display: block;
        color: #875800;
        font-size: 13px;
        margin-top: 6px;
    `,

    guidanceCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-bottom: ${token.marginLG}px;
        background: linear-gradient(135deg, #f0fffb 0%, #e6f7ff 100%);
    `,

    guidanceIcon: css`
        color: #00b8a9;
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
        color: #00b8a9;
        font-size: 16px;
    `,
}));
