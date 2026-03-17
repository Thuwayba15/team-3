import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
    title: "UbuntuLearn",
    description: "UbuntuLearn frontend scaffold",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
