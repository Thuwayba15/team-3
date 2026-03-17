import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    width: 100vw;
    height: 100vh;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `,
  swooshContainer: css`
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  `,
  glassNav: css`
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 85px;
    padding: 22px 110px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(25px) saturate(200%);
    border-radius: 60px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);

    a {
      text-decoration: none;
      color: #6b6b6b;
      font-size: 17px;
      transition: color 0.3s;
      &:hover {
        color: ${token.colorPrimary};
      }
    }
  `,
  brandSection: css`
    position: absolute;
    top: 35%;
    left: 12%;
    z-index: 5;
  `,
  mainLogo: css`
    width: 260px;
  `,
  title: css`
    font-size: 64px;
    font-weight: 400;
    color: #1a1a1a;
    margin: 30px 0 0 0;
  `,
  subtitle: css`
    font-size: 24px;
    color: #999;
    letter-spacing: 2px;
  `,
  actionSection: css`
    position: absolute;
    right: 8%;
    bottom: 15%;
    max-width: 480px;
    text-align: right;
    z-index: 5;
  `,
  robotImg: css`
    width: 420px;
  `,
  placeholderText: css`
    font-size: 20px;
    color: #8c8c8c;
    line-height: 1.6;
    margin-bottom: 30px;
  `,
  dashboardBtn: css`
    border-radius: 12px;
    padding: 0 70px;
    height: 56px;
    font-size: 18px;
    background: white;
    color: #8c8c8c;
    border-color: #f0f0f0;
  `,
  cardStackWrapper: css`
    position: absolute;
    bottom: 0px;
    left: 10%;
    width: 450px;
    height: 550px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 10;
    padding-bottom: 60px;
  `,
  glassCard: css`
    position: absolute;
    width: 380px;
    background: #ffffff;
    border-radius: 24px;
    padding: 24px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    transform-origin: bottom center;
    display: flex;
    flex-direction: column;
  `,
  cardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  `,
  cardHeaderTitle: css`
    font-weight: 700;
    color: #262626;
    font-size: 16px;
  `,
  trendLabel: css`
    color: #52c41a;
    font-weight: 600;
    font-size: 13px;
  `,
  cardValue: css`
    font-size: 42px;
    font-weight: 700;
    margin: 0 0 20px 0;
    color: #1a1a1a;
  `,
  listItem: css`
    margin-bottom: 12px;
  `,
  itemInfo: css`
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #595959;
    margin-bottom: 4px;
  `,
  quizList: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  quizInfo: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  quizLabel: css`
    font-weight: 500;
    color: #434343;
  `,
  quizScore: css`
    font-weight: 700;
  `,
  quizDate: css`
    display: block;
    font-size: 12px;
    color: #bfbfbf;
    margin-bottom: 4px;
  `,
  viewAll: css`
    margin-top: auto;
    padding-top: 15px;
    text-align: center;
    color: #00d2df;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  `,
  alertBox: css`
    background: #fffbe6;
    border: 1px solid #ffe58f;
    padding: 16px;
    border-radius: 12px;
  `,
  alertHeader: css`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    strong {
      font-weight: 600;
    }
  `,
  alertIcon: css`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
  `,
  alertDesc: css`
    font-size: 13px;
    color: #595959;
    line-height: 1.5;
    margin: 0;
  `,
}));