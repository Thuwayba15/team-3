"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    pageHeader: css`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: ${token.marginMD}px;
        margin-bottom: ${token.marginLG}px;
    `,

    subjectTabs: css`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
    `,

    subjectTab: css`
        padding: 6px 18px;
        border-radius: 20px;
        border: 1px solid ${token.colorBorderSecondary};
        background: transparent;
        cursor: pointer;
        font-size: 14px;
        color: ${token.colorTextSecondary};
        font-weight: 500;
        transition: all 0.2s;

        &:hover {
            border-color: #00b8a9;
            color: #00b8a9;
        }
    `,

    subjectTabActive: css`
        background: #00b8a9 !important;
        border-color: #00b8a9 !important;
        color: #fff !important;

        &:hover {
            background: #00a89a !important;
            border-color: #00a89a !important;
            color: #fff !important;
        }
    `,

    subjectSummaryCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-bottom: ${token.marginLG}px;

        .ant-card-body {
            padding: ${token.paddingLG}px;
        }
    `,

    subjectSummaryHeader: css`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: ${token.marginSM}px;
        margin-bottom: ${token.marginMD}px;
    `,

    subjectTitle: css`
        font-size: 18px;
        font-weight: 700;
        color: ${token.colorTextHeading};
        margin: 0;
    `,

    masteredPercent: css`
        font-size: 28px;
        font-weight: 700;
        color: #00b8a9;
        text-align: right;
        line-height: 1;
    `,

    masteredLabel: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        text-align: right;
        margin-top: 2px;
    `,

    progressLabel: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        margin-bottom: 8px;
    `,

    summaryMeta: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        flex-wrap: wrap;
        margin-top: 8px;
    `,

    helperText: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        margin: 0;
    `,

    infoBanner: css`
        border-radius: ${token.borderRadiusLG}px;
        margin-bottom: ${token.marginLG}px;
    `,

    /* ── Timeline ─────────────────────────────────────────────── */
    timeline: css`
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0;
    `,

    timelineItem: css`
        display: flex;
        gap: 20px;
        position: relative;
    `,

    timelineLeft: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
        width: 40px;
    `,

    timelineDot: css`
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #00b8a9;
        color: #fff;
        font-size: 18px;
        flex-shrink: 0;
        z-index: 1;
    `,

    timelineDotInProgress: css`
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #00b8a9;
        background: ${token.colorBgContainer};
        flex-shrink: 0;
        z-index: 1;
    `,

    timelineDotInner: css`
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #00b8a9;
    `,

    timelineDotLocked: css`
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${token.colorFillSecondary};
        color: ${token.colorTextTertiary};
        font-size: 18px;
        flex-shrink: 0;
        z-index: 1;
    `,

    timelineConnector: css`
        flex: 1;
        width: 2px;
        background: ${token.colorBorderSecondary};
        margin: 4px 0;
        min-height: 24px;
    `,

    timelineConnectorActive: css`
        flex: 1;
        width: 2px;
        background: #00b8a9;
        margin: 4px 0;
        min-height: 24px;
    `,

    timelineContent: css`
        flex: 1;
        padding-bottom: ${token.marginLG}px;
    `,

    /* ── Module card ──────────────────────────────────────────── */
    moduleCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-body {
            padding: ${token.paddingLG}px;
        }
    `,

    moduleCardActive: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 2px solid #00b8a9;

        .ant-card-body {
            padding: ${token.paddingLG}px;
        }
    `,

    moduleHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: ${token.marginSM}px;
        margin-bottom: 6px;
    `,

    moduleTitleRow: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        flex-wrap: wrap;
    `,

    moduleTitle: css`
        font-size: 16px;
        font-weight: 600;
        color: ${token.colorTextHeading};
        margin: 0;
    `,

    moduleDesc: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        margin-bottom: ${token.marginMD}px;
    `,

    moduleMeta: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        flex-wrap: wrap;
        margin-bottom: ${token.marginMD}px;
    `,

    topicAction: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        margin-bottom: ${token.marginMD}px;
    `,

    lessonMetaPill: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        background: ${token.colorFillQuaternary};
        padding: 4px 10px;
        border-radius: 999px;
    `,

    reviewLink: css`
        color: #00b8a9 !important;
        font-size: 14px;
        font-weight: 500;
        padding: 0;

        &:hover {
            color: #00a89a !important;
        }
    `,

    moduleProgress: css`
        margin-bottom: ${token.marginMD}px;
    `,

    progressPercent: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        margin-bottom: 6px;
    `,

    /* ── Topic rows ───────────────────────────────────────────── */
    topicList: css`
        display: flex;
        flex-direction: column;
        gap: 0;
    `,

    topicRow: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid ${token.colorBorderSecondary};

        &:last-child {
            border-bottom: none;
        }
    `,

    topicRowHighlighted: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        border-radius: ${token.borderRadius}px;
        background: #f0fafa;
        border: 1px solid #b7e8e4;
        margin: 4px 0;
    `,

    topicLeft: css`
        display: flex;
        align-items: center;
        gap: 10px;
    `,

    topicIcon: css`
        font-size: 16px;
        color: #00b8a9;
        flex-shrink: 0;
    `,

    topicIconLocked: css`
        font-size: 16px;
        color: ${token.colorTextTertiary};
        flex-shrink: 0;
    `,

    topicName: css`
        font-size: 14px;
        color: ${token.colorText};
    `,

    topicNameLocked: css`
        font-size: 14px;
        color: ${token.colorTextTertiary};
    `,

    topicSubtitle: css`
        font-size: 12px;
        color: #00b8a9;
        margin-top: 1px;
    `,

    topicRight: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
    `,

    topicRowCopy: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,

    masteredTag: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    lockedTag: css`
        font-size: 12px;
        color: ${token.colorTextTertiary};
    `,

    continueBtn: css`
        background: #00b8a9 !important;
        border-color: #00b8a9 !important;
        font-size: 13px;
        height: 32px;
        padding: 0 16px;

        &:hover {
            background: #00a89a !important;
            border-color: #00a89a !important;
        }
    `,

    /* Completed topics row (3-column grid) */
    topicGrid: css`
        display: flex;
        flex-wrap: wrap;
        gap: 0;
    `,

    topicGridItem: css`
        display: flex;
        align-items: center;
        gap: 8px;
        width: 33.33%;
        font-size: 14px;
        color: ${token.colorText};
        padding: 8px 0;

        @media (max-width: 640px) {
            width: 100%;
        }
    `,

    emptyState: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px dashed ${token.colorBorderSecondary};
        background: ${token.colorBgContainer};
        padding: ${token.paddingXL}px;
        text-align: center;
    `,
}));
