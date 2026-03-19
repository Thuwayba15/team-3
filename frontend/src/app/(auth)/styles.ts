"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    width: 100%;
    min-height: 100vh;
    background-color: ${token.colorBgContainer};
    position: relative;
    overflow-x: clip;
    display: flex;
    align-items: center;
    padding: ${token.paddingXL}px 0;

    @media (max-width: 991px) {
      align-items: flex-start;
      padding: ${token.paddingLG}px 0;
    }
  `,
  swooshContainer: css`
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  `,
  mainLayout: css`
    display: flex;
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 clamp(16px, 5vw, 56px);
    align-items: center;
    justify-content: space-between;
    gap: clamp(24px, 5vw, 72px);
    z-index: 10;

    @media (max-width: 991px) {
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      gap: ${token.marginXL}px;
    }
  `,
  brandLink: css`
    text-decoration: none;
    color: inherit;
    display: block;
  `,
  brandSection: css`
    flex: 1;
    text-align: center;

    @media (max-width: 991px) {
      margin-bottom: 0;
    }
  `,
  mainLogo: css`
    width: clamp(120px, 24vw, 180px);
  `,
  title: css`
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 500;
    color: ${token.colorTextHeading};
    margin-top: ${token.marginSM}px;
    margin-bottom: 0;
    letter-spacing: -1px;
    line-height: 1.12;
  `,
  subtitle: css`
    font-size: clamp(14px, 2.2vw, 18px);
    color: ${token.colorTextSecondary};
    letter-spacing: 0.08em;
    margin-top: ${token.marginXS}px;
    margin-bottom: 0;
  `,
  loginSection: css`
    flex: 1;
    display: flex;
    justify-content: flex-end;

    @media (max-width: 991px) {
      justify-content: center;
      width: 100%;
    }
  `,
  formWrapper: css`
    width: 100%;
    max-width: 360px;

    @media (max-width: 991px) {
      max-width: 440px;
    }

    .ant-input-affix-wrapper,
    .ant-input,
    .ant-select-selector {
      background: ${token.colorBgContainer} !important;
      border: 1px solid ${token.colorBorderSecondary} !important;
      border-radius: ${token.borderRadiusLG}px !important;
      transition: all ${token.motionDurationMid};
    }

    .ant-input-affix-wrapper {
      padding: 10px 14px !important;

      .ant-input-prefix {
        color: ${token.colorTextDescription};
        margin-right: 10px;
      }

      &:hover {
        border-color: ${token.colorBorder} !important;
      }

      &.ant-input-affix-wrapper-focused {
        border-color: ${token.colorPrimary} !important;
        box-shadow: 0 0 0 2px ${token.colorPrimaryBg} !important;

        .ant-input-prefix {
          color: ${token.colorPrimary};
        }
      }
    }

    .ant-form-item {
      margin-bottom: ${token.marginSM}px;
    }

    .ant-form-item-explain,
    .ant-form-item-extra {
      margin-top: 4px;
      min-height: 0;
    }

    .ant-form-item-explain-error {
      font-size: 12px;
      line-height: 1.35;
      color: ${token.colorErrorText};
      white-space: normal;
      word-break: normal;
      overflow-wrap: anywhere;
    }

    .ant-alert {
      border-radius: ${token.borderRadiusLG}px;
      margin-bottom: ${token.marginSM}px;
      padding: 8px 12px;
    }

    .ant-alert-message,
    .ant-alert-description {
      font-size: 12px;
      line-height: 1.4;
      white-space: normal;
      word-break: normal;
      overflow-wrap: anywhere;
    }

    .ant-form-item-control-input-content {
      display: flex;
      justify-content: flex-end;
    }

    .ant-checkbox-wrapper {
      color: ${token.colorTextSecondary};
      font-size: 13px;

      &:hover .ant-checkbox-inner {
        border-color: ${token.colorPrimary};
      }
    }

    button {
      height: 48px !important;
      border-radius: ${token.borderRadiusLG}px !important;
      font-weight: 600 !important;
      font-size: 16px !important;
      width: 100% !important;
      margin-top: ${token.marginXS}px;
    }
  `,
  registerFormWrapper: css`
    max-width: 420px;

    @media (max-width: 480px) {
      max-width: 100%;
    }
  `,
  loginHeader: css`
    text-align: center;
    margin-bottom: ${token.marginLG}px;
  `,
  loginTitle: css`
    font-size: clamp(24px, 4vw, 30px);
    font-weight: 700;
    color: ${token.colorTextHeading};
    margin: 0;
  `,
  accentLine: css`
    width: 28px;
    height: 4px;
    background: ${token.colorPrimary};
    margin: 8px auto 0;
    border-radius: 999px;
  `,
  footerActions: css`
    text-align: center;
    margin-top: ${token.marginLG}px;

    p {
      color: ${token.colorTextSecondary};
      font-size: ${token.fontSize}px;
      margin-bottom: ${token.marginMD}px;
    }
  `,
  regLink: css`
    color: ${token.colorPrimary};
    font-weight: 600;
    text-decoration: none;
  `,
  educationTeaser: css`
    display: flex;
    align-items: center;
    gap: 10px;
    background: ${token.colorFillTertiary};
    padding: 10px 20px;
    border-radius: 999px;
    width: fit-content;
    margin: 0 auto;
    font-size: 12px;
    color: ${token.colorTextDescription};
  `,
  pulseDot: css`
    width: 7px;
    height: 7px;
    background: ${token.colorSuccess};
    border-radius: 50%;
  `,
}));