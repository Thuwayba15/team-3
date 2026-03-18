"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    topBar: css`
        display: flex;
        justify-content: flex-end;
        margin-bottom: ${token.marginMD}px;

        @media (max-width: 767px) {
            justify-content: stretch;
        }
    `,

    addButton: css`
        background: ${token.colorPrimary};
        border-color: ${token.colorPrimary};

        &:hover {
            background: ${token.colorPrimaryHover} !important;
            border-color: ${token.colorPrimaryHover} !important;
        }

        @media (max-width: 767px) {
            width: 100%;
        }
    `,

    tabs: css`
        margin-bottom: ${token.marginLG}px;

        .ant-tabs-nav {
            margin-bottom: ${token.marginMD}px;
        }

        .ant-tabs-tab {
            border-radius: ${token.borderRadiusSM}px ${token.borderRadiusSM}px 0 0;
            border: 1px solid ${token.colorBorder};
            background: ${token.colorBgContainer};
            margin-inline-end: ${token.marginXXS}px !important;
        }

        .ant-tabs-tab-active {
            border-color: ${token.colorPrimary} !important;
            background: ${token.colorPrimary} !important;
        }

        .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: ${token.colorTextLightSolid} !important;
        }

        .ant-tabs-ink-bar {
            display: none;
        }
    `,

    subjectCard: css`
        height: 100%;
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-body {
            display: flex;
            flex-direction: column;
            height: 100%;
            gap: ${token.marginSM}px;
        }
    `,

    subjectIconWrap: css`
        width: 64px;
        height: 64px;
        border-radius: ${token.borderRadiusLG}px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid ${token.colorBorderSecondary};
    `,

    subjectIcon: css`
        font-size: 30px;
        line-height: 1;
    `,

    subjectTonePrimary: css`
        background: ${token.colorPrimaryBg};
        color: ${token.colorPrimary};
    `,

    subjectToneInfo: css`
        background: ${token.colorInfoBg};
        color: ${token.colorInfo};
    `,

    subjectToneSecondary: css`
        background: ${token.colorSuccessBg};
        color: ${token.colorSuccess};
    `,

    subjectToneDanger: css`
        background: ${token.colorErrorBg};
        color: ${token.colorError};
    `,

    subjectTitle: css`
        margin: 0 !important;
    `,

    subjectStats: css`
        display: flex;
        flex-direction: column;
        gap: ${token.marginXS}px;
        margin-bottom: ${token.marginSM}px;
        flex: 1;
    `,

    subjectStatRow: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,

    subjectStatLabel: css`
        color: ${token.colorTextSecondary};
    `,

    subjectStatValue: css`
        color: ${token.colorTextHeading};
        font-weight: 600;
    `,

    manageButton: css`
        border-color: ${token.colorBorder};
        color: ${token.colorText};

        &:hover {
            color: ${token.colorPrimary} !important;
            border-color: ${token.colorPrimary} !important;
            background: ${token.colorPrimaryBg} !important;
        }
    `,

    tableCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
    `,

    table: css`
        .ant-table-thead > tr > th {
            background: ${token.colorFillQuaternary};
            color: ${token.colorTextSecondary};
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .ant-table-wrapper {
            overflow-x: auto;
        }
    `,

    primaryCellText: css`
        color: ${token.colorTextHeading};
        font-weight: 600;
    `,

    statusTag: css`
        border-radius: 999px;
        border: none;
        padding-inline: ${token.paddingXS}px;
        font-weight: 600;
        margin-inline-end: 0;
    `,

    statusPublished: css`
        background: ${token.colorSuccessBg};
        color: ${token.colorSuccess};
    `,

    statusDraft: css`
        background: ${token.colorWarningBg};
        color: ${token.colorWarning};
    `,

    difficultyEasy: css`
        background: ${token.colorSuccessBg};
        color: ${token.colorSuccess};
    `,

    difficultyMedium: css`
        background: ${token.colorWarningBg};
        color: ${token.colorWarning};
    `,

    difficultyHard: css`
        background: ${token.colorErrorBg};
        color: ${token.colorError};
    `,

    typeTag: css`
        background: ${token.colorFillSecondary};
        color: ${token.colorText};
    `,

    tableAction: css`
        color: ${token.colorPrimary};
        padding: 0;

        &:hover {
            color: ${token.colorPrimaryHover} !important;
        }
    `,

    previewText: css`
        color: ${token.colorText};
        display: block;
        max-width: 320px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        @media (max-width: 767px) {
            max-width: 220px;
        }
    `,
}));
