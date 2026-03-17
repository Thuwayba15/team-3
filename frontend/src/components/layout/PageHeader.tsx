"use client";

import { Typography } from "antd";
import { useStyles } from "./PageHeader.style";

interface IPageHeaderProps {
    title: string;
    subtitle?: string;
}

/**
 * Shared heading block for scaffold pages.
 */
export const PageHeader = ({ title, subtitle }: IPageHeaderProps) => {
    const { styles } = useStyles();

    return (
        <div className={styles.wrapper}>
            <Typography.Title level={2}>{title}</Typography.Title>
            {subtitle ? <Typography.Paragraph className={styles.subtitle}>{subtitle}</Typography.Paragraph> : null}
        </div>
    );
};
