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

        @media (max-width: 575px) {
            flex-direction: column;
            align-items: flex-start;
            gap: ${token.marginXS}px;
        }
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

        @media (max-width: 575px) {
            justify-content: flex-start;
            gap: ${token.marginSM}px;
        }
    `,

    legendItem: css`
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: ${token.colorText};

        @media (max-width: 575px) {
            width: 100%;
        }
    `,

    legendDot: css`
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
    `,

    legendDotPrimary: css`
        background: ${token.colorPrimary};
    `,

    legendDotInfo: css`
        background: ${token.colorInfo};
    `,

    legendDotWarning: css`
        background: ${token.colorWarning};
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

        @media (max-width: 575px) {
            flex-direction: column;
            align-items: flex-start;
            gap: ${token.marginXXS}px;
        }
    `,

    progress: css`
        .ant-progress-bg {
            background: ${token.colorPrimary};
        }
    `,
}));
