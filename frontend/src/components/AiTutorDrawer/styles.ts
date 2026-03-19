"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    context: css`
        padding: ${token.paddingMD}px;
        background: #f0fafa;
        border-bottom: 1px solid #b7e8e4;
        flex-shrink: 0;
    `,

    contextLabel: css`
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #00b8a9;
        font-weight: 600;
        margin-bottom: 2px;
    `,

    contextTopic: css`
        font-size: 13px;
        font-weight: 600;
        color: ${token.colorTextHeading};
    `,

    langRow: css`
        padding: ${token.paddingSM}px ${token.paddingMD}px;
        border-bottom: 1px solid ${token.colorBorderSecondary};
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    `,

    langLabel: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        white-space: nowrap;
    `,

    messages: css`
        flex: 1;
        overflow-y: auto;
        padding: ${token.paddingMD}px;
        display: flex;
        flex-direction: column;
        gap: ${token.marginMD}px;
    `,

    msgRow: css`
        display: flex;
        gap: 10px;
        align-items: flex-start;
    `,

    msgRowUser: css`
        flex-direction: row-reverse;
    `,

    bubble: css`
        max-width: 78%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
    `,

    bubbleAi: css`
        background: ${token.colorFillSecondary};
        color: ${token.colorText};
        border-radius: 4px 12px 12px 12px;
    `,

    bubbleUser: css`
        background: #00b8a9;
        color: #fff;
        border-radius: 12px 4px 12px 12px;
    `,

    avatarAi: css`
        background: #00b8a9 !important;
        flex-shrink: 0;
    `,

    avatarUser: css`
        background: ${token.colorFillTertiary} !important;
        color: ${token.colorTextSecondary} !important;
        flex-shrink: 0;
    `,

    typingBubble: css`
        background: ${token.colorFillSecondary};
        border-radius: 4px 12px 12px 12px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 6px;
    `,

    inputRow: css`
        padding: ${token.paddingMD}px;
        border-top: 1px solid ${token.colorBorderSecondary};
        display: flex;
        gap: 8px;
        flex-shrink: 0;
    `,

    sendBtn: css`
        background: #00b8a9 !important;
        border-color: #00b8a9 !important;
        height: 40px;
        width: 40px;

        &:hover {
            background: #00a89a !important;
            border-color: #00a89a !important;
        }

        &:disabled {
            background: ${token.colorFillSecondary} !important;
            border-color: ${token.colorBorderSecondary} !important;
        }
    `,
}));
