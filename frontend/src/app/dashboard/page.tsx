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
    const { isAuthenticated, userId, isLoading } = useAuthState();
    const { logout } = useAuthActions();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {// Also check if it's not loading to avoid redirecting before auth state is determined
            router.replace("/login");
        }
    }, [isAuthenticated, router]);

    // Lets not return anything if its still loading to avoid flashing
    if (isLoading) {
        return null; 
    }

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
