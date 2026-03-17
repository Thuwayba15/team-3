"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    errorAlert: css`
        margin-bottom: ${token.marginLG}px;
    `,

    toolbar: css`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: ${token.marginSM}px;
        margin-bottom: ${token.marginLG}px;
    `,

    search: css`
        width: 100%;

        @media (min-width: 768px) {
            width: 280px;
        }
    `,

    filters: css`
        display: flex;
        flex-wrap: wrap;
        gap: ${token.marginSM}px;
        flex: 1;
        width: 100%;

        @media (min-width: 768px) {
            width: auto;
        }
    `,

    filterSelect: css`
        width: 100%;

        @media (min-width: 480px) {
            width: 130px;
        }
    `,

    addButtonWrapper: css`
        width: 100%;

        @media (min-width: 768px) {
            width: auto;
            margin-left: auto;
        }
    `,

    addButton: css`
        width: 100%;
        background: ${token.colorPrimary};
        border-color: ${token.colorPrimary};

        &:hover {
            background: ${token.colorPrimaryHover} !important;
            border-color: ${token.colorPrimaryHover} !important;
        }

        @media (min-width: 768px) {
            width: auto;
        }
    `,

    table: css`
        .ant-table-thead > tr > th {
            background: ${token.colorBgContainer};
            font-weight: 600;
            color: ${token.colorTextSecondary};
            font-size: 13px;
        }

        .ant-table-row:hover > td {
            background: ${token.colorFillAlter} !important;
        }
    `,

    roleTag: css`
        border-radius: 12px;
        font-size: 12px;
        padding: 1px 10px;
        border: none;
    `,

    roleTagDefault: css`
        background: ${token.colorFillQuaternary};
        color: ${token.colorTextTertiary};
    `,

    roleTagAdmin: css`
        background: ${token.colorFillSecondary};
        color: ${token.colorText};
    `,

    roleTagTutor: css`
        background: ${token.colorPrimaryBg};
        color: ${token.colorPrimary};
    `,

    roleTagParent: css`
        background: ${token.colorWarningBg};
        color: ${token.colorWarning};
    `,

    roleTagStudent: css`
        background: ${token.colorInfoBg};
        color: ${token.colorInfo};
    `,

    statusTag: css`
        border-radius: 12px;
        font-size: 12px;
        padding: 1px 10px;
        border: none;
    `,

    editLink: css`
        color: ${token.colorPrimary};
        padding: 0;

        &:hover {
            color: ${token.colorPrimaryHover} !important;
        }
    `,

    disableLink: css`
        color: ${token.colorError};
        padding: 0;

        &:hover {
            color: ${token.colorErrorHover} !important;
        }
    `,

    actions: css`
        display: flex;
        gap: ${token.marginMD}px;
        align-items: center;
    `,
}));
