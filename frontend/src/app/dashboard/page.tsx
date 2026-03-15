"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography } from "antd";
import { useAuthActions, useAuthState } from "@/providers/auth";

const { Title, Paragraph } = Typography;

/**
 * Minimal protected dashboard page.
 * Redirects unauthenticated users back to the login page.
 */
export default function DashboardPage() {
    const { isAuthenticated, userId } = useAuthState();
    const { logout } = useAuthActions();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div style={{ padding: "48px", maxWidth: "640px", margin: "0 auto" }}>
            <Title level={2}>Dashboard</Title>
            <Paragraph>
                You are signed in.{userId ? ` User ID: ${userId}` : ""}
            </Paragraph>
            <Button type="primary" danger onClick={logout}>
                Sign out
            </Button>
        </div>
    );
}
