import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    min-height: 100vh;
    background: linear-gradient(135deg, ${token.colorBgLayout} 0%, ${token.colorPrimary}5 100%);
    padding: ${token.paddingXL}px 0;
  `,

  content: css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${token.paddingLG}px;
  `,

  heroSection: css`
    text-align: center;
    margin-bottom: ${token.paddingXL}px;
    padding: ${token.paddingXL}px 0;
  `,

  heroContent: css`
    max-width: 800px;
    margin: 0 auto;
  `,

  heroTitle: css`
    color: ${token.colorPrimary} !important;
    font-family: 'Lexend', sans-serif !important;
    font-weight: 700 !important;
    margin-bottom: ${token.paddingLG}px !important;
    font-size: clamp(32px, 5vw, 48px) !important;
  `,

  heroSubtitle: css`
    font-size: 18px;
    line-height: 1.6;
    color: ${token.colorTextSecondary};
    margin-bottom: 0;
  `,

  section: css`
    margin-bottom: ${token.paddingXL}px;
  `,

  contactGrid: css`
    margin-bottom: ${token.paddingXL}px;
  `,

  contactCard: css`
    border-radius: ${token.borderRadiusLG}px !important;
    border: 1px solid ${token.colorBorderSecondary} !important;
    height: 100% !important;
    text-align: center;
    padding: ${token.paddingLG}px !important;
    transition: all 0.3s ease !important;
    background: ${token.colorBgContainer} !important;

    &:hover {
      box-shadow: 0 12px 40px ${token.colorPrimary}15 !important;
      transform: translateY(-8px);
    }
  `,

  contactIcon: css`
    font-size: 48px;
    color: ${token.colorPrimary};
    margin-bottom: ${token.paddingMD}px;
    display: flex;
    justify-content: center;
  `,

  contactTitle: css`
    color: ${token.colorPrimary} !important;
    font-family: 'Lexend', sans-serif !important;
    margin-bottom: ${token.paddingSM}px !important;
    text-align: center;
  `,

  contactContent: css`
    color: ${token.colorText};
    font-weight: 600;
    display: block;
    margin-bottom: ${token.paddingXS}px;
  `,

  contactDescription: css`
    color: ${token.colorTextSecondary};
    font-size: 14px;
    display: block;
  `,

  formCard: css`
    border-radius: ${token.borderRadiusLG * 2}px !important;
    border: 1px solid ${token.colorBorderSecondary} !important;
    box-shadow: 0 8px 32px ${token.colorPrimary}10 !important;
    padding: ${token.paddingXL}px !important;
    background: ${token.colorBgContainer} !important;
  `,

  formContent: css`
    padding-right: ${token.paddingLG}px;

    @media (max-width: 991px) {
      padding-right: 0;
      margin-bottom: ${token.paddingXL}px;
    }
  `,

  formTitle: css`
    color: ${token.colorPrimary} !important;
    font-family: 'Lexend', sans-serif !important;
    margin-bottom: ${token.paddingMD}px !important;
  `,

  formDescription: css`
    font-size: 16px;
    line-height: 1.6;
    color: ${token.colorTextSecondary};
    margin-bottom: ${token.paddingXL}px;
  `,

  contactForm: css`
    .ant-form-item-label > label {
      font-weight: 600;
      color: ${token.colorText};
    }

    .ant-input,
    .ant-input-affix-wrapper {
      border-radius: ${token.borderRadiusLG}px !important;
      border: 1px solid ${token.colorBorderSecondary} !important;
      transition: all 0.3s ease !important;

      &:focus,
      &:focus-within {
        border-color: ${token.colorPrimary} !important;
        box-shadow: 0 0 0 2px ${token.colorPrimary}10 !important;
      }
    }

    .ant-input-affix-wrapper .ant-input-prefix {
      color: ${token.colorPrimary};
    }
  `,

  submitButton: css`
    border-radius: ${token.borderRadiusLG}px !important;
    font-weight: 600 !important;
    font-family: 'Lexend', sans-serif !important;
    height: 48px !important;
    box-shadow: 0 4px 16px ${token.colorPrimary}25 !important;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${token.colorPrimary}35 !important;
    }
  `,

  faqContent: css`
    padding-left: ${token.paddingLG}px;
    border-left: 2px solid ${token.colorBorderSecondary};

    @media (max-width: 991px) {
      padding-left: 0;
      border-left: none;
      border-top: 2px solid ${token.colorBorderSecondary};
      padding-top: ${token.paddingLG}px;
    }
  `,

  faqTitle: css`
    color: ${token.colorPrimary} !important;
    font-family: 'Lexend', sans-serif !important;
    margin-bottom: ${token.paddingLG}px !important;
  `,

  faqList: css`
    margin-bottom: ${token.paddingXL}px;
  `,

  faqItem: css`
    margin-bottom: ${token.paddingLG}px;
    padding-bottom: ${token.paddingLG}px;
    border-bottom: 1px solid ${token.colorFillTertiary};

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
  `,

  faqQuestion: css`
    color: ${token.colorText} !important;
    font-family: 'Lexend', sans-serif !important;
    margin-bottom: ${token.paddingSM}px !important;
    font-weight: 600 !important;
  `,

  faqAnswer: css`
    color: ${token.colorTextSecondary};
    line-height: 1.6;
    margin-bottom: 0;
  `,

  ctaSection: css`
    text-align: center;
    padding-top: ${token.paddingLG}px;
    border-top: 1px solid ${token.colorBorderSecondary};
  `,

  ctaText: css`
    font-size: 16px;
    color: ${token.colorTextSecondary};
    margin-bottom: ${token.paddingMD}px;
  `,

  ctaButton: css`
    border-radius: ${token.borderRadiusLG}px !important;
    font-weight: 600 !important;
    font-family: 'Lexend', sans-serif !important;
    height: 48px !important;
    box-shadow: 0 4px 16px ${token.colorPrimary}25 !important;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${token.colorPrimary}35 !important;
    }
  `,
}));
