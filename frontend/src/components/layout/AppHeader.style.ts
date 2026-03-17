import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    header: css`
        background: ${token.colorBgContainer};
        border-bottom: 1px solid ${token.colorBorderSecondary};
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${token.marginMD}px;
        padding: 0 ${token.paddingLG}px;
    `,

    brand: css`
        display: flex;
        align-items: center;
        gap: ${token.marginXS}px;

        .ant-typography {
            margin: 0;
            color: ${token.colorPrimary};
            font-weight: 700;
        }
    `,

    controls: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
    `,

    logoAvatar: css`
        background-color: ${token.colorPrimary};
        color: #ffffff;
        font-weight: 700;
    `,

    iconButton: css`
        color: ${token.colorTextSecondary};
    `,

    userWrap: css`
        display: flex;
        align-items: center;
        gap: ${token.marginXS}px;
    `,

    select: css`
        min-width: 130px;
    `,
}));
