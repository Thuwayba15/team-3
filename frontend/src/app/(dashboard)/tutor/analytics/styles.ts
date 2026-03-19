"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    pageHeader: css`
        margin-bottom: ${token.marginLG}px;
    `,

    statsRow: css`
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: ${token.marginMD}px;
        margin-bottom: ${token.marginMD}px;

        @media (max-width: 900px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 480px) {
            grid-template-columns: 1fr;
        }
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
        font-size: 20px;
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

    stableBadge: css`
        font-size: 12px;
        color: ${token.colorPrimary};
        background: ${token.colorPrimaryBg};
        border: 1px solid ${token.colorPrimaryBorder};
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
        margin-bottom: ${token.marginMD}px;

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    chartPlaceholder: css`
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${token.colorFillAlter};
        border-radius: ${token.borderRadius}px;
        border: 1px dashed ${token.colorBorderSecondary};
        color: ${token.colorTextSecondary};
        font-size: 13px;
    `,

    twoCol: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${token.marginMD}px;
        margin-bottom: ${token.marginMD}px;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,

    topicRow: css`
        margin-bottom: ${token.marginMD}px;

        &:last-child {
            margin-bottom: 0;
        }
    `,

    topicHeader: css`
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: ${token.colorText};
        margin-bottom: 6px;
    `,

    topicPercent: css`
        font-weight: 600;
        color: ${token.colorPrimary};
    `,

    histogramPlaceholder: css`
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${token.colorFillAlter};
        border-radius: ${token.borderRadius}px;
        border: 1px dashed ${token.colorBorderSecondary};
        color: ${token.colorTextSecondary};
        font-size: 13px;
        margin-bottom: ${token.marginMD}px;
    `,

    scoreStats: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        text-align: center;
    `,

    scoreStat: css`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,

    scoreLabel: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    scoreValue: css`
        font-size: 22px;
        font-weight: 700;
    `,

    tableCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-head-title {
            font-weight: 600;
        }

        .ant-card-body {
            padding: 0;
        }

        .ant-table-thead > tr > th {
            background: ${token.colorBgContainer};
            font-weight: 600;
            font-size: 13px;
            color: ${token.colorTextSecondary};
        }
    `,
}));
