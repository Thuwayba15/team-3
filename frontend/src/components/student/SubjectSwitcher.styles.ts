"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    root: css`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: ${token.marginSM}px;
    `,

    subjectTab: css`
        padding: 6px 18px;
        border-radius: 20px;
        border: 1px solid ${token.colorBorderSecondary};
        background: transparent;
        cursor: pointer;
        font-size: 14px;
        color: ${token.colorTextSecondary};
        font-weight: 500;
        transition: all 0.2s;

        &:hover {
            border-color: #00b8a9;
            color: #00b8a9;
        }
    `,

    subjectTabActive: css`
        background: #00b8a9 !important;
        border-color: #00b8a9 !important;
        color: #fff !important;

        &:hover {
            background: #00a89a !important;
            border-color: #00a89a !important;
            color: #fff !important;
        }
    `,

    addButton: css`
        border-radius: 20px;
    `,
}));
