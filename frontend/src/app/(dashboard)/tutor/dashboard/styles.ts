"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    pageHeader: css`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: ${token.marginMD}px;
        margin-bottom: ${token.marginLG}px;
        flex-wrap: wrap;
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
        color: ${token.colorPrimary};
    `,

    trendBadge: css`
        font-size: 12px;
        color: ${token.colorSuccess};
        background: ${token.colorSuccessBg};
        border: 1px solid ${token.colorSuccessBorder};
        border-radius: 12px;
        padding: 2px 8px;
    `,

    warningBadge: css`
        font-size: 12px;
        color: ${token.colorWarning};
        background: ${token.colorWarningBg};
        border: 1px solid ${token.colorWarningBorder};
        border-radius: 12px;
        padding: 2px 8px;
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

    sectionCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        height: 100%;

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    subjectRow: css`
        margin-bottom: ${token.marginMD}px;

        &:last-child {
            margin-bottom: 0;
        }
    `,

    subjectHeader: css`
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: ${token.colorText};
        margin-bottom: 6px;
    `,

    subjectPercent: css`
        font-weight: 600;
    `,

    riskItem: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        padding: ${token.paddingSM}px 0;
        border-bottom: 1px solid ${token.colorBorderSecondary};

        &:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
    `,

    riskInfo: css`
        flex: 1;
        min-width: 0;
    `,

    riskName: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `,

    riskSubject: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        display: block;
    `,

    riskScore: css`
        font-size: 14px;
        font-weight: 700;
        min-width: 36px;
        text-align: right;
    `,

    viewAllLink: css`
        padding: 0;
        margin-top: ${token.marginSM}px;
        font-size: 13px;
    `,

    activityItem: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        padding: ${token.paddingSM}px 0;
        border-bottom: 1px solid ${token.colorBorderSecondary};

        &:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
    `,

    activityIcon: css`
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${token.colorPrimaryBg};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 14px;
        color: ${token.colorPrimary};
    `,

    activityInfo: css`
        flex: 1;
        min-width: 0;
    `,

    activityTitle: css`
        font-size: 13px;
        font-weight: 500;
        color: ${token.colorText};
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `,

    activityTime: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        display: block;
    `,

    quickActionsGrid: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${token.marginSM}px;
    `,

    quickActionBtn: css`
        height: auto;
        padding: ${token.paddingSM}px;
        border-radius: ${token.borderRadius}px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        white-space: normal;
        text-align: center;
        line-height: 1.3;
        width: 100%;
    `,
}));
