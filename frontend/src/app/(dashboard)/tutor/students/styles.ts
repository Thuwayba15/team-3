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

    headerLeft: css`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,

    headerControls: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        flex-wrap: wrap;
    `,

    searchInput: css`
        width: 220px;
    `,

    tableCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-body {
            padding: 0;
        }

        .ant-table-thead > tr > th {
            background: ${token.colorBgContainer};
            font-weight: 600;
            font-size: 13px;
            color: ${token.colorTextSecondary};
        }

        .ant-table-tbody > tr > td {
            padding: ${token.paddingSM}px ${token.paddingMD}px;
        }

        .ant-table-tbody > tr:hover > td {
            background: ${token.colorFillAlter};
        }
    `,

    progressCell: css`
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 160px;
    `,

    progressPercent: css`
        font-size: 13px;
        font-weight: 500;
        color: ${token.colorText};
    `,

    studentName: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
    `,
}));
