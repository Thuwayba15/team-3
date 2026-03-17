"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
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

    trendBadge: css`
        font-size: 12px;
        color: #52c41a;
        background: #f6ffed;
        border: 1px solid #b7eb8f;
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

    chartsRow: css``,

    chartCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        height: 100%;

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    piePlaceholder: css`
        height: 240px;
        border: 1px dashed ${token.colorBorder};
        border-radius: ${token.borderRadius}px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: ${token.marginMD}px;
    `,

    legend: css`
        display: flex;
        justify-content: center;
        gap: ${token.marginLG}px;
        flex-wrap: wrap;
    `,

    legendItem: css`
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: ${token.colorText};
    `,

    legendDot: css`
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
    `,

    progressList: css`
        display: flex;
        flex-direction: column;
        gap: ${token.marginMD}px;
    `,

    progressItem: css``,

    progressHeader: css`
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: ${token.colorText};
        margin-bottom: 4px;
    `,
}));
