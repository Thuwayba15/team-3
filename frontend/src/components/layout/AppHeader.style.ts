import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    header: css`
        background: ${token.colorBgContainer};
        border-bottom: 1px solid ${token.colorBorderSecondary};
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${token.marginMD}px;
        padding: ${token.paddingSM}px ${token.paddingLG}px;
        min-height: 76px;
        line-height: normal;

        @media (max-width: 991px) {
            flex-direction: column;
            align-items: stretch;
            padding: ${token.paddingSM}px ${token.paddingMD}px;
            gap: ${token.marginSM}px;
            min-height: 88px;
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
        border: none;
        background: transparent;
        cursor: pointer;
        padding: 0;
        color: ${token.colorText};

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

    userAvatar: css`
        background: ${token.colorPrimaryBg};
        color: ${token.colorPrimary};
    `,

    profileDropdown: css`
        width: 320px;
        background: ${token.colorBgElevated};
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadiusLG}px;
        box-shadow: ${token.boxShadowSecondary};
        padding: ${token.paddingMD}px;
        display: flex;
        flex-direction: column;
        gap: ${token.marginSM}px;

        @media (max-width: 575px) {
            width: min(320px, calc(100vw - 24px));
        }
    `,

    profileRow: css`
        display: flex;
        flex-direction: column;
        gap: ${token.marginXXS}px;
    `,

    profileLabel: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        text-transform: uppercase;
        letter-spacing: 0.04em;
    `,

    profileValue: css`
        color: ${token.colorText};
        word-break: break-word;
    `,

    usernameInput: css`
        width: 100%;
    `,

    profileActions: css`
        display: flex;
        justify-content: flex-end;
    `,

    saveButton: css`
        background: ${token.colorPrimary};
        border-color: ${token.colorPrimary};

        &:hover {
            background: ${token.colorPrimaryHover} !important;
            border-color: ${token.colorPrimaryHover} !important;
        }
    `,

    logoutButton: css`
        color: ${token.colorPrimary};
        font-weight: 600;
        border-radius: ${token.borderRadiusSM}px;

        &:hover {
            color: ${token.colorPrimaryHover} !important;
            background: ${token.colorPrimaryBg} !important;
        }
    `,
}));
