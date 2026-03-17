"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    toolbar: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        margin-bottom: ${token.marginLG}px;
    `,

    search: css`
        width: 280px;
    `,

    filters: css`
        display: flex;
        gap: ${token.marginSM}px;
        flex: 1;
    `,

    addButton: css`
        margin-left: auto;
        background: #00b8a9;
        border-color: #00b8a9;

        &:hover {
            background: #00a89a !important;
            border-color: #00a89a !important;
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

    statusTag: css`
        border-radius: 12px;
        font-size: 12px;
        padding: 1px 10px;
        border: none;
    `,

    editLink: css`
        color: #00b8a9;
        padding: 0;

        &:hover {
            color: #00a89a !important;
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
