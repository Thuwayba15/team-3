"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, responsive }) => ({
  container: css`
    width: 100vw;
    min-height: 100vh;
    background-color: #fff;
    position: relative;
    overflow-x: hidden;
    display: flex;
    align-items: center;
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
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 5%;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    ${responsive.mobile} { flex-direction: column; padding-top: 60px; }
  `,
  brandSection: css`
    flex: 1;
    text-align: center;
    ${responsive.mobile} { margin-bottom: 50px; }
  `,
  mainLogo: css` width: 180px; `,
  title: css`
    font-size: clamp(40px, 5vw, 56px);
    font-weight: 400;
    color: #1a1a1a;
    margin-top: 10px;
    letter-spacing: -1.5px;
  `,
  subtitle: css` font-size: 18px; color: #bbb; letter-spacing: 2px; `,
  loginSection: css`
    flex: 1;
    display: flex;
    justify-content: flex-end;
    ${responsive.mobile} { justify-content: center; width: 100%; }
  `,
  formWrapper: css`
    width: 100%;
    max-width: 340px;

    /* MODERN INPUTS - Light, Minimalist, Internal Icons */
    .ant-input-affix-wrapper {
      background: transparent !important;
      border: 1.5px solid #eee !important;
      border-radius: 12px !important;
      padding: 10px 16px !important;
      transition: all 0.2s ease;
      
      .ant-input-prefix { color: #ccc; margin-right: 12px; }

      &:hover { border-color: #ddd !important; }
      
      &.ant-input-affix-wrapper-focused {
        border-color: #0F766E !important;
        background: #fff !important;
        box-shadow: 0 4px 15px rgba(0, 210, 223, 0.08) !important;
        .ant-input-prefix { color: #0F766E; }
      }
    }

    /* RIGHT ALIGN REMEMBER ME */
    .ant-form-item-control-input-content {
      display: flex;
      justify-content: flex-end; /* Pushes the checkbox to the right */
    }

    .ant-checkbox-wrapper {
      color: #999;
      font-size: 13px;
      &:hover .ant-checkbox-inner { border-color: #0F766E; }
    }

    /* THE BUTTON - Rounded and Brand-colored */
    button {
      height: 50px !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      font-size: 16px !important;
      background: #0F766E !important;
      border: none !important;
      width: 100% !important;
      margin-top: 10px;
      box-shadow: 0 4px 12px rgba(0, 210, 223, 0.15) !important;
      &:hover { transform: translateY(-1px); opacity: 0.9; }
    }
  `,
  loginHeader: css`
    text-align: center;
    margin-bottom: 35px;
  `,
  loginTitle: css` font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 0; `,
  accentLine: css`
    width: 25px;
    height: 4px;
    background: #0F766E;
    margin: 8px auto 0;
    border-radius: 10px;
  `,
  footerActions: css`
    text-align: center;
    margin-top: 30px;
    p { color: #888; font-size: 14px; margin-bottom: 30px; }
  `,
  regLink: css` color: #0F766E; font-weight: 600; text-decoration: none; `,
  educationTeaser: css`
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f9f9f9;
    padding: 10px 20px;
    border-radius: 50px;
    width: fit-content;
    margin: 0 auto;
    font-size: 12px;
    color: #999;
  `,
  pulseDot: css`
    width: 7px;
    height: 7px;
    background: #52c41a;
    border-radius: 50%;
  `
}));