"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    pageHeader: css`
        margin-bottom: ${token.marginLG}px;
    `,

    profileCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-bottom: ${token.marginLG}px;
    `,

    profileInner: css`
        display: flex;
        align-items: center;
        gap: ${token.marginMD}px;
    `,

    profileAvatar: css`
        background: #00b8a9 !important;
        font-weight: 600;
        flex-shrink: 0;
    `,

    profileName: css`
        font-size: 16px;
        font-weight: 700;
        color: ${token.colorText};
        margin-bottom: 2px;
    `,

    subjectsRow: css`
        margin-bottom: ${token.marginLG}px;
    `,

    subjectCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        height: 100%;
    `,

    subjectCardHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: ${token.marginSM}px;
    `,

    subjectCardName: css`
        font-size: 15px;
        font-weight: 600;
        color: ${token.colorText};
    `,

    subjectCardPercent: css`
        font-size: 15px;
        font-weight: 700;
    `,

    subjectProgress: css`
        margin-bottom: ${token.marginMD}px;
    `,

    topicRow: css`
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: ${token.colorTextSecondary};
        margin-bottom: 4px;
    `,

    viewDetails: css`
        color: #00b8a9;
        font-size: 13px;
        padding: 0;
        margin-top: ${token.marginXS}px;

        &:hover {
            color: #00a89a !important;
        }
    `,

    masteryCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-bottom: ${token.marginLG}px;

        .ant-card-head-title {
            padding: ${token.paddingMD}px 0;
        }
    `,

    masteryTile: css`
        border-radius: ${token.borderRadiusSM}px;
        padding: ${token.paddingLG}px ${token.paddingMD}px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100px;
        gap: 4px;
    `,

    masteryPercent: css`
        font-size: 28px;
        font-weight: 700;
        color: #fff;
        line-height: 1.1;
    `,

    masteryName: css`
        font-size: 12px;
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
    `,

    bottomRow: css`
        margin-bottom: ${token.marginLG}px;
    `,

    bottomCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        height: 100%;

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    assessmentRow: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: ${token.paddingMD}px 0;
        border-bottom: 1px solid ${token.colorBorderSecondary};

        &:last-child {
            border-bottom: none;
        }
    `,

    assessmentSubject: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
        margin-bottom: 2px;
    `,

    activityRow: css`
        display: flex;
        align-items: center;
        gap: ${token.marginMD}px;
        padding: ${token.paddingMD}px 0;
        border-bottom: 1px solid ${token.colorBorderSecondary};

        &:last-child {
            border-bottom: none;
        }
    `,

    activityIconWrap: css`
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    `,

    activityLabel: css`
        font-size: 13px;
        font-weight: 500;
        color: ${token.colorText};
        margin-bottom: 2px;
    `,
}));
