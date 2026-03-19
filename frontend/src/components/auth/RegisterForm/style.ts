import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    form: css`
        width: 100%;
    `,

    inlineError: css`
        display: block;
        margin-top: -${token.marginXS}px;
        margin-bottom: ${token.marginSM}px;
        font-size: 12px;
        line-height: 1.35;
    `,

    nameRow: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${token.marginSM}px;

        @media (max-width: 575px) {
            grid-template-columns: 1fr;
            gap: 0;
        }
    `,

    nameField: css`
        margin-bottom: ${token.marginSM}px;
    `,

    submitButton: css`
        width: 100%;
    `,
}));
