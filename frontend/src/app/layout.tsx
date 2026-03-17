import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
    title: "Team3",
    description: "Team3 application",
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
