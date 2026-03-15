"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout/AuthPageLayout";
import { LoginForm } from "@/components/auth/LoginForm/LoginForm";
import { useAuthActions, useAuthState } from "@/providers/auth";
import { ILoginValues } from "@/providers/auth/context";

export default function LoginPage() {
    const { isLoading, isAuthenticated, errorMessage } = useAuthState();
    const { login, clearAuthError } = useAuthActions();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (values: ILoginValues): Promise<void> => {
        await login(values);
    };

    return (
        <AuthPageLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue."
        >
            <LoginForm
                isLoading={isLoading}
                errorMessage={errorMessage}
                onSubmit={handleSubmit}
                onErrorDismiss={clearAuthError}
            />
        </AuthPageLayout>
    );
}
