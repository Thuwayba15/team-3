"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
    guardLoadingContainer: css`
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    `,
}));
