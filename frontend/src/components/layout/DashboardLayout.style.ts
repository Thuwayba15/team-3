import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    root: css`
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background: ${token.colorBgLayout};
    `,

    body: css`
        flex: 1;
        min-height: 0;
        overflow: hidden;
    `,

    content: css`
        height: 100%;
        overflow-y: auto;
        padding: ${token.paddingLG}px;

        @media (max-width: 991px) {
            padding: ${token.paddingSM}px;
        }
    `,

    contentSurface: css`
        background: ${token.colorBgContainer};
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        min-height: 100%;
        padding: ${token.paddingLG}px;

        @media (max-width: 991px) {
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
