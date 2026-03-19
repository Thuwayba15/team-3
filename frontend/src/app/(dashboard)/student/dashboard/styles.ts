"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
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

    statHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: ${token.marginSM}px;
    `,

    statIcon: css`
        font-size: 22px;
        color: #00b8a9;
    `,

    statBadge: css`
        font-size: 12px;
        color: #52c41a;
        font-weight: 500;
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
        margin-top: -4px;
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
        margin-top: -4px;
    `,

    heatmapPlaceholder: css`
        height: 140px;
        background: ${token.colorFillQuaternary};
        border-radius: ${token.borderRadius}px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${token.colorTextTertiary};
        font-size: 13px;
        margin-bottom: ${token.marginMD}px;
    `,

    heatmapLegend: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    legendDots: css`
        display: flex;
        align-items: center;
        gap: 4px;
    `,

    quizCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-bottom: ${token.marginLG}px;

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    quizItem: css`
        padding: ${token.paddingSM}px 0;
        border-bottom: 1px solid ${token.colorFillSecondary};

        &:last-child {
            border-bottom: none;
        }
    `,

    quizHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
    `,

    quizName: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
    `,

    quizScore: css`
        font-size: 14px;
        font-weight: 700;
    `,

    quizDate: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    viewAllLink: css`
        color: #00b8a9;
        padding: 0;
        font-size: 13px;

        &:hover {
            color: #00a89a !important;
        }
    `,

    upNextCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    upNextItem: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        padding: ${token.paddingSM}px 0;
        border-bottom: 1px solid ${token.colorFillSecondary};

        &:last-child {
            border-bottom: none;
        }
    `,

    upNextIcon: css`
        font-size: 16px;
        color: #00b8a9;
        flex-shrink: 0;
    `,

    upNextInfo: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,

    upNextTitle: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
    `,

    upNextDue: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,
}));
