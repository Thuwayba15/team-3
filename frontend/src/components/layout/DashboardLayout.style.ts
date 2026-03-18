import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    root: css`
        min-height: 100vh;
        background: ${token.colorBgLayout};
    `,

    body: css`
        min-height: calc(100vh - 64px);
    `,

    content: css`
        padding: ${token.paddingLG}px;

        @media (max-width: 991px) {
            padding: ${token.paddingSM}px;
        }
    `,

    contentSurface: css`
        background: ${token.colorBgContainer};
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        min-height: calc(100vh - 120px);
        padding: ${token.paddingLG}px;

        @media (max-width: 991px) {
            min-height: calc(100vh - 112px);
            padding: ${token.paddingMD}px;
        }
    `,

    navigationDrawerRoot: css`
        .ant-drawer-content {
            background: ${token.colorBgBase};
        }

        .ant-drawer-body {
            padding: 0;
        }
    `,

    navigationDrawer: css`
        .ant-drawer-header {
            display: none;
        }
    `,
}));
