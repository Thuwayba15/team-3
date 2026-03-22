"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    drawerTitle: css`
        display: flex;
        align-items: center;
        gap: 8px;
    `,

    drawerTitleIcon: css`
        color: #1e40af;
    `,

    speakingIcon: css`
        color: #16a34a;
        animation: speakingPulse 1s ease-in-out infinite;

        @keyframes speakingPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }
    `,

    context: css`
        padding: ${token.paddingMD}px;
        background: ${token.colorFillSecondary};
        border-bottom: 1px solid ${token.colorBorderSecondary};
        flex-shrink: 0;
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

    langSelect: css`
        flex: 1;
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

    bubbleWrapper: css`
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: 78%;
    `,

    speakBtn: css`
        align-self: flex-start;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        color: ${token.colorTextTertiary};
        padding: 0 2px;
        line-height: 1;
        transition: color 0.2s;

        &:hover {
            color: #1e40af;
        }
    `,

    speakBtnActive: css`
        color: #1e40af;
    `,

    bubble: css`
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
        background: #1e40af;
        color: #fff;
        border-radius: 12px 4px 12px 12px;
    `,

    avatarAi: css`
        background: #1e40af !important;
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

    thinkingText: css`
        font-size: 13px;
    `,

    inputRow: css`
        padding: ${token.paddingMD}px;
        border-top: 1px solid ${token.colorBorderSecondary};
        display: flex;
        gap: 8px;
        align-items: flex-end;
        flex-shrink: 0;
    `,

    textInput: css`
        flex: 1;
        resize: none;
    `,

    sendBtn: css`
        background: #1e40af !important;
        border-color: #1e40af !important;
        height: 40px;
        width: 40px;
        flex-shrink: 0;

        &:hover {
            background: #1d4ed8 !important;
            border-color: #1d4ed8 !important;
        }

        &:disabled {
            background: ${token.colorFillSecondary} !important;
            border-color: ${token.colorBorderSecondary} !important;
        }
    `,

    micButton: css`
        height: 40px;
        width: 40px;
        flex-shrink: 0;
        border-color: ${token.colorBorder};

        &:hover {
            border-color: #1e40af;
            color: #1e40af;
        }
    `,

    micButtonActive: css`
        background: #ef4444 !important;
        border-color: #ef4444 !important;
        color: #fff !important;

        &:hover {
            background: #dc2626 !important;
            border-color: #dc2626 !important;
        }

        animation: recordingPulse 1.5s ease-in-out infinite;

        @keyframes recordingPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
        }
    `,

    recordingHint: css`
        padding: ${token.paddingXS}px ${token.paddingMD}px;
        background: #fef2f2;
        border-top: 1px solid #fecaca;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #dc2626;
        flex-shrink: 0;
    `,

    liveBadge: css`
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: #fff;
        background: #16a34a;
        border-radius: 4px;
        padding: 1px 5px;
        line-height: 1.6;
    `,

    livePanel: css`
        padding: ${token.paddingMD}px;
        border-top: 1px solid ${token.colorBorderSecondary};
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: ${token.colorFillSecondary};
        flex-shrink: 0;
    `,

    livePanelStatus: css`
        display: flex;
        align-items: center;
        gap: 8px;
    `,

    livePanelActions: css`
        display: flex;
        align-items: center;
        gap: 8px;
    `,

    liveStatusText: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
    `,

    listeningDot: css`
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #16a34a;
        flex-shrink: 0;
        animation: listeningPulse 1.5s ease-in-out infinite;

        @keyframes listeningPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); }
            50% { box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
        }
    `,

    aiSpeakingDot: css`
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #1e40af;
        flex-shrink: 0;
        animation: aiSpeakingPulse 0.8s ease-in-out infinite;

        @keyframes aiSpeakingPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(30, 64, 175, 0.4); }
            50% { box-shadow: 0 0 0 6px rgba(30, 64, 175, 0); }
        }
    `,

    muteButton: css`
        height: 36px;
        width: 36px;
        flex-shrink: 0;
    `,

    muteButtonMuted: css`
        color: #ef4444 !important;
        border-color: #ef4444 !important;

        &:hover {
            color: #dc2626 !important;
            border-color: #dc2626 !important;
        }
    `,

    endCallButton: css`
        height: 36px;
        width: 36px;
        flex-shrink: 0;
    `,

    liveVoiceButton: css`
        height: 40px;
        width: 40px;
        flex-shrink: 0;
        border-color: #16a34a;
        color: #16a34a;

        &:hover {
            border-color: #15803d !important;
            color: #15803d !important;
        }
    `,

    recordingDot: css`
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ef4444;
        flex-shrink: 0;
        animation: dotBlink 1s ease-in-out infinite;

        @keyframes dotBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
    `,
}));
