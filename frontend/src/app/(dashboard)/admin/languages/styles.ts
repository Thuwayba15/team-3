"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    languageCardsRow: css`
        margin-bottom: ${token.marginLG}px;
    `,

    languageCard: css`
        height: 100%;
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-body {
            display: flex;
            flex-direction: column;
            gap: ${token.marginMD}px;
            padding: ${token.paddingLG}px;
        }
    `,

    cardHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: ${token.marginMD}px;

        @media (max-width: 575px) {
            flex-direction: column;
            align-items: stretch;
        }
    `,

    languageMeta: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;

        @media (max-width: 575px) {
            width: 100%;
        }
    `,

    languageCode: css`
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 700;
        flex-shrink: 0;
    `,

    toneInfo: css`
        background: ${token.colorInfoBg};
        color: ${token.colorInfo};
    `,

    tonePrimary: css`
        background: ${token.colorPrimaryBg};
        color: ${token.colorPrimary};
    `,

    toneWarning: css`
        background: ${token.colorWarningBg};
        color: ${token.colorWarning};
    `,

    toneSuccess: css`
        background: ${token.colorSuccessBg};
        color: ${token.colorSuccess};
    `,

    languageName: css`
        margin: 0 !important;
        font-size: 20px !important;
        color: ${token.colorTextHeading} !important;
    `,

    progressBlock: css`
        display: flex;
        flex-direction: column;
        gap: ${token.marginXS}px;
    `,

    progressHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${token.marginSM}px;

        @media (max-width: 575px) {
            flex-direction: column;
            align-items: flex-start;
        }
    `,

    progressLabel: css`
        color: ${token.colorTextSecondary};
    `,

    progressPercent: css`
        color: ${token.colorText};
        font-weight: 600;
    `,

    translationProgress: css`
        .ant-progress-bg {
            background: ${token.colorPrimary};
        }
    `,

    translatedItemsText: css`
        color: ${token.colorTextDescription};
        font-size: 13px;
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

    contentTypeValue: css`
        color: ${token.colorTextHeading};
        font-weight: 600;
    `,

    progressValue: css`
        font-weight: 600;
    `,

    progressHigh: css`
        color: ${token.colorSuccess};
    `,

    progressMid: css`
        color: ${token.colorWarning};
    `,

    progressLow: css`
        color: ${token.colorError};
    `,
}));
