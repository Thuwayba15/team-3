"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    card: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};
        overflow: hidden;
    `,

    errorAlert: css`
        margin-bottom: ${token.marginLG}px;
    `,

    toolbar: css`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: ${token.marginSM}px;
        margin-bottom: ${token.marginLG}px;
    `,

    search: css`
        width: 100%;

        @media (min-width: 768px) {
            width: 280px;
        }
    `,

    filters: css`
        display: flex;
        flex-wrap: wrap;
        gap: ${token.marginSM}px;
        flex: 1;
        width: 100%;

        @media (min-width: 768px) {
            width: auto;
        }
    `,

    filterSelect: css`
        width: 100%;

        @media (min-width: 480px) {
            width: 150px;
        }
    `,

    addButtonWrapper: css`
        width: 100%;

        @media (min-width: 768px) {
            width: auto;
            margin-left: auto;
        }
    `,

    addButton: css`
        width: 100%;
        background: ${token.colorPrimary};
        border-color: ${token.colorPrimary};

        &:hover {
            background: ${token.colorPrimaryHover} !important;
            border-color: ${token.colorPrimaryHover} !important;
        }

        @media (min-width: 768px) {
            width: auto;
        }
    `,

    table: css`
        .ant-table-thead > tr > th {
            background: ${token.colorBgContainer};
            font-weight: 600;
            color: ${token.colorTextSecondary};
            font-size: 13px;
        }

        .ant-table-row:hover > td {
            background: ${token.colorFillAlter} !important;
        }
    `,

    paginationRow: css`
        display: flex;
        justify-content: flex-end;
        padding-top: ${token.paddingMD}px;
    `,

    roleTag: css`
        border-radius: 12px;
        font-size: 12px;
        padding: 1px 10px;
        border: none;
    `,

    roleTagDefault: css`
        background: ${token.colorFillQuaternary};
        color: ${token.colorTextTertiary};
    `,

    roleTagAdmin: css`
        background: ${token.colorFillSecondary};
        color: ${token.colorText};
    `,

    roleTagTutor: css`
        background: ${token.colorPrimaryBg};
        color: ${token.colorPrimary};
    `,

    roleTagParent: css`
        background: ${token.colorWarningBg};
        color: ${token.colorWarning};
    `,

    roleTagStudent: css`
        background: ${token.colorInfoBg};
        color: ${token.colorInfo};
    `,

    statusTag: css`
        border-radius: 12px;
        font-size: 12px;
        padding: 1px 10px;
        border: none;
    `,

    editLink: css`
        color: ${token.colorPrimary};
        padding: 0;

        &:hover {
            color: ${token.colorPrimaryHover} !important;
        }
    `,

    disableLink: css`
        color: ${token.colorError};
        padding: 0;

        &:hover {
            color: ${token.colorErrorHover} !important;
        }
    `,

    activateLink: css`
        color: ${token.colorSuccess};
        padding: 0;

        &:hover {
            color: ${token.colorSuccessActive} !important;
        }
    `,

    actions: css`
        display: flex;
        flex-wrap: wrap;
        gap: ${token.marginMD}px;
        align-items: center;
    `,

    userNameText: css`
        color: ${token.colorTextSecondary};
        font-size: 12px;
    `,

    statusCell: css`
        display: flex;
        align-items: center;
        gap: ${token.marginXS}px;
    `,

    modalHint: css`
        margin-bottom: ${token.marginMD}px;
        color: ${token.colorTextSecondary};
    `,

    modalActions: css`
        display: flex;
        justify-content: flex-end;
        gap: ${token.marginSM}px;
        padding-top: ${token.paddingSM}px;
    `,

    nameRow: css`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: ${token.marginSM}px;

        @media (max-width: 575px) {
            grid-template-columns: 1fr;
        }
    `,

    drawerBody: css`
        padding-bottom: ${token.paddingLG}px;
    `,
}));
