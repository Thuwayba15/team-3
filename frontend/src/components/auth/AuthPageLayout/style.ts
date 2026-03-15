import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
    wrapper: css`
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: ${token.colorBgLayout};
        padding: ${token.paddingLG}px;
    `,

    card: css`
        width: 100%;
        max-width: 420px;
        border-radius: ${token.borderRadiusLG}px;
        box-shadow: ${token.boxShadow};
    `,

    header: css`
        text-align: center;
        margin-bottom: ${token.marginXL}px;
    `,

    title: css`
        font-size: ${token.fontSizeHeading2}px;
        font-weight: 700;
        color: ${token.colorTextHeading};
        margin: 0 0 ${token.marginXS}px 0;
    `,

    subtitle: css`
        font-size: ${token.fontSize}px;
        color: ${token.colorTextSecondary};
        margin: 0;
    `,
}));
