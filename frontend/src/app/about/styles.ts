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

  sectionTitle: css`
    color: ${token.colorPrimary} !important;
    font-family: 'Lexend', sans-serif !important;
    margin-bottom: ${token.paddingLG}px !important;
    text-align: center;
  `,

  missionCard: css`
    border-radius: ${token.borderRadiusLG * 2}px !important;
    border: 1px solid ${token.colorBorderSecondary} !important;
    box-shadow: 0 8px 32px ${token.colorPrimary}10 !important;
    padding: ${token.paddingXL}px !important;
    text-align: center;
    background: ${token.colorBgContainer} !important;
  `,

  missionText: css`
    font-size: 16px;
    line-height: 1.8;
    color: ${token.colorText};
    margin-bottom: 0;
  `,

  valuesGrid: css`
    margin-top: ${token.paddingXL}px;
  `,

  valueCard: css`
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

  valueIcon: css`
    font-size: 48px;
    color: ${token.colorPrimary};
    margin-bottom: ${token.paddingMD}px;
    display: flex;
    justify-content: center;
  `,

  valueTitle: css`
    color: ${token.colorPrimary} !important;
    font-family: 'Lexend', sans-serif !important;
    margin-bottom: ${token.paddingMD}px !important;
    text-align: center;
  `,

  valueDescription: css`
    color: ${token.colorTextSecondary};
    line-height: 1.6;
    margin-bottom: 0;
  `,

  storyCard: css`
    border-radius: ${token.borderRadiusLG * 2}px !important;
    border: 1px solid ${token.colorBorderSecondary} !important;
    box-shadow: 0 8px 32px ${token.colorPrimary}10 !important;
    padding: ${token.paddingXL}px !important;
    background: ${token.colorBgContainer} !important;
  `,

  storyContent: css`
    padding-right: ${token.paddingLG}px;
  `,

  storyText: css`
    font-size: 16px;
    line-height: 1.8;
    color: ${token.colorText};
    margin-bottom: ${token.paddingLG}px;
  `,

  storyStats: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  `,

  statItem: css`
    text-align: center;
    padding: ${token.paddingLG}px;
    background: ${token.colorFillTertiary};
    border-radius: ${token.borderRadiusLG}px;
    transition: all 0.3s ease;

    &:hover {
      background: ${token.colorFillSecondary};
      transform: translateY(-4px);
    }
  `,

  statNumber: css`
    color: ${token.colorPrimary} !important;
    font-family: 'Lexend', sans-serif !important;
    font-weight: 700 !important;
    margin-bottom: ${token.paddingXS}px !important;
  `,

  statLabel: css`
    color: ${token.colorTextSecondary};
    font-size: 14px;
    font-weight: 500;
  `,

  ctaSection: css`
    margin-bottom: ${token.paddingXL}px;
  `,

  ctaCard: css`
    border-radius: ${token.borderRadiusLG * 2}px !important;
    background: linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}dd) !important;
    border: none !important;
    color: ${token.colorTextLightSolid} !important;
    text-align: center;
    padding: ${token.paddingXL}px !important;
    box-shadow: 0 12px 40px ${token.colorPrimary}25 !important;
  `,

  ctaContent: css`
    max-width: 600px;
    margin: 0 auto;
  `,

  ctaTitle: css`
    color: ${token.colorTextLightSolid} !important;
    font-family: 'Lexend', sans-serif !important;
    margin-bottom: ${token.paddingLG}px !important;
  `,

  ctaText: css`
    color: ${token.colorTextLightSolid} !important;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: ${token.paddingXL}px !important;
    opacity: 0.9;
  `,

  ctaButton: css`
    background: ${token.colorTextLightSolid} !important;
    color: ${token.colorPrimary} !important;
    border: none !important;
    border-radius: ${token.borderRadiusLG}px !important;
    padding: ${token.paddingMD}px ${token.paddingXL}px !important;
    font-weight: 600 !important;
    font-family: 'Lexend', sans-serif !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 16px ${token.colorTextLightSolid}25 !important;

    &:hover {
      background: ${token.colorBgContainer} !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${token.colorTextLightSolid}35 !important;
    }
  `,

  ctaButtonSecondary: css`
    background: transparent !important;
    color: ${token.colorTextLightSolid} !important;
    border: 2px solid ${token.colorTextLightSolid} !important;
    border-radius: ${token.borderRadiusLG}px !important;
    padding: ${token.paddingMD}px ${token.paddingXL}px !important;
    font-weight: 600 !important;
    font-family: 'Lexend', sans-serif !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: ${token.colorTextLightSolid} !important;
      color: ${token.colorPrimary} !important;
      transform: translateY(-2px);
    }
  `,
}));
