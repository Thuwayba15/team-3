
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    wrapper: css`
        margin-bottom: ${token.marginLG}px;

        .ant-typography {
            margin-bottom: 0;
        }
    `,

    subtitle: css`
        color: ${token.colorTextSecondary};
        margin-top: ${token.marginXXS}px;
    `,
}));
