"use client";

import { Card, Typography } from "antd";
import { ReactNode } from "react";
import { useStyles } from "./style";

const { Title, Paragraph } = Typography;

interface IAuthPageLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

/**
 * Shared page-level wrapper for all authentication screens 
 */
export const AuthPageLayout = ({
    title,
    subtitle,
    children,
}: IAuthPageLayoutProps) => {
    const { styles } = useStyles();

    return (
        <div className={styles.wrapper}>
            <Card className={styles.card}>
                <div className={styles.header}>
                    <Title level={2} className={styles.title}>
                        {title}
                    </Title>

                    {subtitle && (
                        <Paragraph className={styles.subtitle}>
                            {subtitle}
                        </Paragraph>
                    )}
                </div>

                {children}
            </Card>
        </div>
    );
};
