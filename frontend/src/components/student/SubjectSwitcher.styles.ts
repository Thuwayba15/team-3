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
            border-color: #1e40af;
            color: #1e40af;
        }
    `,

    subjectTabActive: css`
        background: #1e40af !important;
        border-color: #1e40af !important;
        color: #fff !important;

        &:hover {
            background: #1d4ed8 !important;
            border-color: #1d4ed8 !important;
            color: #fff !important;
        }
    `,

    addButton: css`
        border-radius: 20px;
    `,
}));
