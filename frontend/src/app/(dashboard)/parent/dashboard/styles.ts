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

    headerRight: css`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: ${token.marginMD}px;
    `,

    childBadge: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
    `,

    addChildBtn: css`
        background: #00b8a9 !important;
        border-color: #00b8a9 !important;

        &:hover {
            background: #00a89a !important;
            border-color: #00a89a !important;
        }
    `,

    childSwitcher: css`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        background: ${token.colorFillSecondary};
        border-radius: 40px;
        padding: 4px 8px;
    `,

    childPill: css`
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 32px;
        border: none;
        cursor: pointer;
        background: transparent;
        transition: background 0.2s;
        font-size: 13px;
        color: ${token.colorTextSecondary};

        &:hover {
            background: ${token.colorBgContainer};
        }
    `,

    childPillActive: css`
        background: ${token.colorBgContainer} !important;
        color: ${token.colorText} !important;
        font-weight: 600;
        box-shadow: ${token.boxShadowTertiary};
    `,

    childAvatar: css`
        background: ${token.colorFillTertiary} !important;
        color: ${token.colorTextSecondary} !important;
        font-weight: 600;
        font-size: 11px;
    `,

    childAvatarActive: css`
        background: #00b8a9 !important;
        color: #fff !important;
        font-weight: 600;
        font-size: 11px;
    `,

    childPillName: css`
        font-size: 13px;
    `,

    childName: css`
        font-weight: 600;
        color: ${token.colorText};
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

    standingBadge: css`
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

    subjectCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        height: 100%;

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    subjectRow: css`
        margin-bottom: ${token.marginMD}px;
    `,

    subjectHeader: css`
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        font-size: 14px;
        color: ${token.colorText};
    `,

    subjectPercent: css`
        font-weight: 600;
    `,

    alertCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-bottom: ${token.marginMD}px;

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    alertItem: css`
        background: #fffbe6;
        border: 1px solid #ffe58f;
        border-radius: ${token.borderRadius}px;
        padding: ${token.paddingMD}px;
        display: flex;
        gap: ${token.marginSM}px;
    `,

    alertIcon: css`
        font-size: 18px;
        color: #faad14;
        flex-shrink: 0;
        margin-top: 2px;
    `,

    alertTitle: css`
        font-weight: 600;
        color: ${token.colorText};
        margin-bottom: 4px;
        display: block;
    `,

    alertDesc: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        display: block;
        margin-bottom: 8px;
    `,

    alertLink: css`
        color: #00b8a9;
        font-size: 13px;
        padding: 0;

        &:hover {
            color: #00a89a !important;
        }
    `,

    activityCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    activityItem: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: ${token.paddingMD}px 0;
        border-bottom: 1px solid ${token.colorBorderSecondary};

        &:last-child {
            border-bottom: none;
        }
    `,

    activityInfo: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,

    activityTitle: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
    `,

    activityTime: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    activityScore: css`
        font-weight: 700;
        color: #52c41a;
        font-size: 14px;
    `,

    activityTag: css`
        background: ${token.colorFillSecondary};
        color: ${token.colorTextSecondary};
        border: none;
        border-radius: 4px;
        font-size: 12px;
        padding: 2px 8px;
    `,
}));
