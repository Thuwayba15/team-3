"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({

    /* ── List view ────────────────────────────────────────────── */
    pageHeader: css`
        margin-bottom: ${token.marginLG}px;
    `,

    moduleCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-bottom: ${token.marginMD}px;

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    lessonRow: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid ${token.colorBorderSecondary};
        cursor: pointer;
        transition: background 0.15s;

        &:last-child {
            border-bottom: none;
        }

        &:hover .lesson-title {
            color: #1e40af;
        }
    `,

    lessonLeft: css`
        display: flex;
        align-items: center;
        gap: 12px;
    `,

    lessonIcon: css`
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        flex-shrink: 0;
    `,

    lessonIconCompleted: css`
        background: #e0f2fe;
        color: #1e40af;
    `,

    lessonIconCurrent: css`
        background: #e0f2fe;
        color: #1e40af;
    `,

    lessonIconLocked: css`
        background: ${token.colorFillSecondary};
        color: ${token.colorTextTertiary};
    `,

    lessonTitle: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
        transition: color 0.15s;
    `,

    lessonMeta: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        margin-top: 2px;
    `,

    lessonRight: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        flex-shrink: 0;
    `,

    /* ── Detail view ──────────────────────────────────────────── */
    detailRoot: css`
        display: flex;
        gap: ${token.marginLG}px;
        align-items: flex-start;

        @media (max-width: 768px) {
            flex-direction: column;
        }
    `,

    detailMain: css`
        flex: 1;
        min-width: 0;
    `,

    breadcrumb: css`
        font-size: 13px;
        color: #1e40af;
        margin-bottom: ${token.marginSM}px;
        display: flex;
        align-items: center;
        gap: 6px;
    `,

    backBtn: css`
        color: ${token.colorTextSecondary};
        padding: 0;
        margin-right: ${token.marginSM}px;

        &:hover {
            color: #1e40af !important;
        }
    `,

    lessonHeading: css`
        font-size: 24px;
        font-weight: 700;
        color: ${token.colorTextHeading};
        margin: 0 0 ${token.marginLG}px;
    `,

    sectionTitle: css`
        font-size: 17px;
        font-weight: 600;
        color: ${token.colorTextHeading};
        margin: ${token.marginLG}px 0 ${token.marginSM}px;
    `,

    sectionText: css`
        font-size: 14px;
        color: ${token.colorText};
        line-height: 1.7;
    `,

    highlightBox: css`
        background: #f0f9ff;
        border-left: 4px solid #1e40af;
        border-radius: 0 ${token.borderRadius}px ${token.borderRadius}px 0;
        padding: ${token.paddingMD}px ${token.paddingLG}px;
        margin: ${token.marginMD}px 0;
    `,

    highlightLabel: css`
        font-size: 13px;
        font-weight: 600;
        color: #1e40af;
        margin-bottom: ${token.marginSM}px;
    `,

    formula: css`
        font-size: 18px;
        font-weight: 600;
        color: ${token.colorTextHeading};
        text-align: center;
        padding: ${token.paddingSM}px 0;
        letter-spacing: 1px;
    `,

    exampleBox: css`
        background: ${token.colorFillQuaternary};
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadius}px;
        padding: ${token.paddingMD}px ${token.paddingLG}px;
        margin: ${token.marginMD}px 0;
        font-size: 14px;
        color: ${token.colorText};
        line-height: 1.8;
    `,

    stepList: css`
        list-style: none;
        padding: 0;
        margin: ${token.marginSM}px 0 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
    `,

    stepItem: css`
        display: flex;
        gap: 10px;
        font-size: 14px;
        color: ${token.colorText};
        line-height: 1.6;
    `,

    stepNumber: css`
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #1e40af;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 1px;
    `,

    detailFooter: css`
        display: flex;
        justify-content: flex-end;
        margin-top: ${token.marginXL}px;
        padding-top: ${token.marginLG}px;
        border-top: 1px solid ${token.colorBorderSecondary};
    `,

    nextBtn: css`
        background: #1e40af !important;
        border-color: #1e40af !important;
        height: 40px;
        padding: 0 28px;

        &:hover {
            background: #1d4ed8 !important;
            border-color: #1d4ed8 !important;
        }
    `,

    /* ── Right sidebar ────────────────────────────────────────── */
    progressPanel: css`
        width: 220px;
        flex-shrink: 0;

        @media (max-width: 768px) {
            width: 100%;
        }
    `,

    progressCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-bottom: ${token.marginMD}px;

        .ant-card-head-title {
            font-weight: 600;
            font-size: 14px;
        }

        .ant-card-body {
            padding: ${token.paddingMD}px;
        }
    `,

    completionRow: css`
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: ${token.colorTextSecondary};
        margin-bottom: 6px;
    `,

    topicList: css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: ${token.marginMD}px;
    `,

    topicItem: css`
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
    `,

    topicDotCompleted: css`
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #1e40af;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 10px;
        flex-shrink: 0;
    `,

    topicDotCurrent: css`
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid #1e40af;
        background: ${token.colorBgContainer};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    `,

    topicDotCurrentInner: css`
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #1e40af;
    `,

    topicDotLocked: css`
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid ${token.colorBorderSecondary};
        background: ${token.colorBgContainer};
        flex-shrink: 0;
    `,

    topicNameCurrent: css`
        color: ${token.colorText};
        font-weight: 500;
    `,

    topicNameOther: css`
        color: ${token.colorTextSecondary};
    `,

    aiCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        text-align: center;

        .ant-card-body {
            padding: ${token.paddingMD}px;
        }
    `,

    aiIcon: css`
        font-size: 32px;
        color: #1e40af;
        margin-bottom: ${token.marginSM}px;
    `,

    aiTitle: css`
        font-size: 14px;
        font-weight: 600;
        color: ${token.colorTextHeading};
        margin-bottom: 6px;
    `,

    aiSubtitle: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        margin-bottom: ${token.marginSM}px;
        line-height: 1.5;
    `,

    aiLink: css`
        color: #1e40af !important;
        font-size: 13px;
        font-weight: 500;
        padding: 0;

        &:hover {
            color: #1d4ed8 !important;
        }
    `,
}));
