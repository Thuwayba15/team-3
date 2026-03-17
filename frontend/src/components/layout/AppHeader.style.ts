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
        height: auto;
        line-height: normal;

        @media (max-width: 991px) {
            flex-direction: column;
            align-items: stretch;
            padding: ${token.paddingSM}px ${token.paddingMD}px;
            gap: ${token.marginSM}px;
        }
    `,

    brandRow: css`
        display: flex;
        align-items: center;
        gap: ${token.marginXXS}px;
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

    brandTitle: css`
        @media (max-width: 575px) {
            font-size: 16px !important;
        }
    `,

    controls: css`
        display: flex;
        align-items: center;
        gap: ${token.marginSM}px;
        flex-wrap: wrap;

        @media (max-width: 991px) {
            width: 100%;
        }
    `,

    logoAvatar: css`
        background-color: ${token.colorPrimary};
        color: ${token.colorTextLightSolid};
        font-weight: 700;
    `,

    iconButton: css`
        color: ${token.colorTextSecondary};
    `,

    userWrap: css`
        display: flex;
        align-items: center;
        gap: ${token.marginXS}px;

        @media (max-width: 575px) {
            min-width: 0;

            .ant-typography {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 110px;
            }
        }
    `,

    select: css`
        min-width: 130px;

        @media (max-width: 575px) {
            flex: 1;
            min-width: 120px;
        }
    `,
}));
