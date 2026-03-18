"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    panelCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        height: 100%;
    `,

    reviewCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        margin-top: ${token.marginLG}px;
    `,

    panelHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: ${token.marginSM}px;
        margin-bottom: ${token.marginMD}px;

        @media (max-width: 767px) {
            flex-direction: column;
            align-items: stretch;
        }
    `,

    panelTitle: css`
        margin: 0 !important;
        color: ${token.colorTextHeading} !important;
    `,

    panelSubtitle: css`
        color: ${token.colorTextSecondary};
        display: block;
    `,

    primaryButton: css`
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

    selectedSubjectTag: css`
        background: ${token.colorPrimaryBg};
        color: ${token.colorPrimary};
        border: 1px solid ${token.colorPrimaryBorder};
        border-radius: 999px;
        font-weight: 600;
        margin: 0;
    `,

    subjectTable: css`
        .ant-table-thead > tr > th {
            background: ${token.colorFillQuaternary};
            color: ${token.colorTextSecondary};
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .ant-table-tbody > tr {
            cursor: pointer;
        }
    `,

    selectedSubjectRow: css`
        td {
            background: ${token.colorPrimaryBg} !important;
        }
    `,

    subjectNameCell: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,

    subjectName: css`
        font-weight: 600;
        color: ${token.colorTextHeading};
    `,

    subjectCode: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    iconAction: css`
        color: ${token.colorPrimary};

        &:hover {
            color: ${token.colorPrimaryHover} !important;
            background: ${token.colorPrimaryBg} !important;
        }
    `,

    deleteAction: css`
        color: ${token.colorError};

        &:hover {
            color: ${token.colorErrorHover} !important;
            background: ${token.colorErrorBg} !important;
        }
    `,

    steps: css`
        margin-bottom: ${token.marginMD}px;
    `,

    uploadDragger: css`
        .ant-upload {
            padding: ${token.paddingLG}px ${token.paddingMD}px !important;
        }
    `,

    uploadIcon: css`
        color: ${token.colorPrimary};
        font-size: 24px;
    `,

    uploadTitle: css`
        color: ${token.colorTextHeading};
        font-weight: 600;
        margin-bottom: ${token.marginXXS}px;
    `,

    uploadHint: css`
        color: ${token.colorTextSecondary};
        margin-bottom: 0;
    `,

    fileList: css`
        margin-top: ${token.marginMD}px;
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadius}px;
        overflow: hidden;
    `,

    fileItem: css`
        padding-inline: ${token.paddingMD}px !important;
    `,

    fileName: css`
        color: ${token.colorText};
    `,

    fileSize: css`
        color: ${token.colorTextSecondary};
        font-size: 12px;
    `,

    generateRow: css`
        display: flex;
        justify-content: flex-end;
        margin-top: ${token.marginMD}px;
        margin-bottom: ${token.marginSM}px;

        @media (max-width: 767px) {
            justify-content: stretch;
        }
    `,

    infoAlert: css`
        border-radius: ${token.borderRadius}px;
    `,

    approveAllButton: css`
        border-color: ${token.colorPrimary};
        color: ${token.colorPrimary};

        &:hover {
            border-color: ${token.colorPrimaryHover} !important;
            color: ${token.colorPrimaryHover} !important;
            background: ${token.colorPrimaryBg} !important;
        }

        @media (max-width: 767px) {
            width: 100%;
        }
    `,

    generatedAt: css`
        display: block;
        color: ${token.colorTextSecondary};
        margin-bottom: ${token.marginSM}px;
    `,

    reviewTabs: css`
        .ant-tabs-nav {
            margin-bottom: ${token.marginSM}px;
        }
    `,

    reviewTable: css`
        .ant-table-thead > tr > th {
            background: ${token.colorFillQuaternary};
            color: ${token.colorTextSecondary};
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
    `,

    reviewItemCell: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,

    reviewItemTitle: css`
        color: ${token.colorTextHeading};
        font-weight: 600;
    `,

    reviewItemDetail: css`
        color: ${token.colorTextSecondary};
        font-size: 12px;
    `,

    confidenceText: css`
        font-weight: 600;
    `,

    confidenceHigh: css`
        color: ${token.colorSuccess};
    `,

    confidenceMedium: css`
        color: ${token.colorWarning};
    `,

    confidenceLow: css`
        color: ${token.colorError};
    `,

    reviewStatusTag: css`
        margin-inline-end: 0;
        border-radius: 999px;
        border: none;
        font-weight: 600;
    `,

    reviewPending: css`
        background: ${token.colorWarningBg};
        color: ${token.colorWarning};
    `,

    reviewApproved: css`
        background: ${token.colorSuccessBg};
        color: ${token.colorSuccess};
    `,

    reviewChanges: css`
        background: ${token.colorErrorBg};
        color: ${token.colorError};
    `,

    approveAction: css`
        border-color: ${token.colorSuccessBorder};
        color: ${token.colorSuccess};

        &:hover {
            border-color: ${token.colorSuccess} !important;
            color: ${token.colorSuccess} !important;
            background: ${token.colorSuccessBg} !important;
        }
    `,

    requestChangesAction: css`
        border-color: ${token.colorErrorBorder};
        color: ${token.colorError};

        &:hover {
            border-color: ${token.colorError} !important;
            color: ${token.colorError} !important;
            background: ${token.colorErrorBg} !important;
        }
    `,

    subjectForm: css`
        margin-top: ${token.marginSM}px;
    `,
}));
