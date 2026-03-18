"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    sectionCard: css`
        border-radius: ${token.borderRadiusLG}px;
        border: 1px solid ${token.colorBorderSecondary};

        .ant-card-head-title {
            font-weight: 600;
        }
    `,

    templateCard: css`
        height: 100%;
        border-radius: ${token.borderRadius}px;
        border: 1px solid ${token.colorBorderSecondary};
        background: ${token.colorFillQuaternary};

        .ant-card-body {
            display: flex;
            flex-direction: column;
            gap: ${token.marginSM}px;
            height: 100%;
        }
    `,

    templateTitle: css`
        margin: 0 !important;
        color: ${token.colorTextHeading} !important;
    `,

    templateTextArea: css`
        .ant-input {
            resize: none;
            border-color: ${token.colorBorder};
            background: ${token.colorBgContainer};
        }
    `,

    templateActions: css`
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: ${token.marginXS}px;
        flex-wrap: wrap;
        margin-top: auto;
    `,

    resetButton: css`
        color: ${token.colorTextSecondary};
        font-size: 12px;
        font-weight: 600;

        &:hover {
            color: ${token.colorText} !important;
            background: ${token.colorFillSecondary} !important;
        }
    `,

    editButton: css`
        border-color: ${token.colorBorder};
        color: ${token.colorText};
        font-size: 12px;

        &:hover {
            border-color: ${token.colorPrimary} !important;
            color: ${token.colorPrimary} !important;
        }
    `,

    settingsRow: css`
        margin-top: ${token.marginLG}px;
    `,

    settingsStack: css`
        width: 100%;
    `,

    settingHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: ${token.marginSM}px;
    `,

    settingLabel: css`
        color: ${token.colorText};
        font-weight: 500;
    `,

    settingLabelBlock: css`
        color: ${token.colorText};
        font-weight: 500;
        display: block;
        margin-bottom: ${token.marginXS}px;
    `,

    settingValue: css`
        color: ${token.colorPrimary};
        font-weight: 700;
    `,

    slider: css`
        margin-top: ${token.marginXS}px;

        .ant-slider-track {
            background: ${token.colorPrimary};
        }

        .ant-slider-handle::after {
            box-shadow: 0 0 0 2px ${token.colorPrimary};
        }
    `,

    fullWidthInput: css`
        width: 100%;
    `,

    notice: css`
        margin-top: ${token.marginLG}px;
        border-radius: ${token.borderRadius}px;
    `,

    saveButton: css`
        width: 100%;
        margin-top: ${token.marginMD}px;
        background: ${token.colorPrimary};
        border-color: ${token.colorPrimary};
        height: 44px;
        font-weight: 600;

        &:hover {
            background: ${token.colorPrimaryHover} !important;
            border-color: ${token.colorPrimaryHover} !important;
        }
    `,
}));
