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

    errorAlert: css`
        margin-bottom: ${token.marginMD}px;
    `,

    rememberRow: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
}));
