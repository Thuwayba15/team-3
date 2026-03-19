import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
    form: css`
        width: 100%;
    `,

    submitButton: css`
        width: 100%;
        margin-top: ${token.marginXS}px;
        height: 40px;
        font-weight: 600;
    `,

    inlineError: css`
        display: block;
        margin-top: -${token.marginXS}px;
        margin-bottom: ${token.marginSM}px;
        font-size: 12px;
        line-height: 1.35;
    `,

    rememberRow: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
}));
