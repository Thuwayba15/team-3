"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { StyleProvider } from "antd-style";
import { ReactNode } from "react";
import { AuthProvider } from "@/providers/auth";
import themeConfig from "@/theme/themeConfig";

interface IAppProvidersProps {
    children: ReactNode;
}

export const AppProviders = ({ children }: IAppProvidersProps) => {
    return (
        <AntdRegistry>
            <ConfigProvider theme={themeConfig}>
                <StyleProvider>
                    <AuthProvider>{children}</AuthProvider>
                </StyleProvider>
            </ConfigProvider>
        </AntdRegistry>
    );
};
