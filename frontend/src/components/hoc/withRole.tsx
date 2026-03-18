"use client";

import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { useAuthState } from "@/providers/auth";
import type { AppRole } from "@/types/navigation";

/**
 * HOC that guards a page to a specific set of allowed roles.
 *
 * - Unauthenticated users are redirected to /login.
 * - Authenticated users whose role is not in allowedRoles are redirected
 *   to their own role's dashboard (e.g. /student/dashboard).
 *
 * Usage:
 *   export default withRole(["admin"])(AdminDashboardPage);
 *   export default withRole(["student", "tutor"])(SharedPage);
 */
export function withRole<P extends object>(allowedRoles: AppRole[]) {
    return function (WrappedComponent: ComponentType<P>) {
        function RoleGuard(props: P) {
            const { isLoading, isAuthenticated, role } = useAuthState();
            const router = useRouter();

            useEffect(() => {
                if (isLoading) return;

                if (!isAuthenticated) {
                    router.replace("/login");
                    return;
                }

                if (role && !allowedRoles.includes(role)) {
                    router.replace(`/${role}/dashboard`);
                }
            }, [isLoading, isAuthenticated, role, router]);

            if (isLoading || !isAuthenticated || (role && !allowedRoles.includes(role))) {
                return (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "100vh",
                        }}
                    >
                        <Spin size="large" />
                    </div>
                );
            }

            return <WrappedComponent {...props} />;
        }

        RoleGuard.displayName = `withRole(${WrappedComponent.displayName ?? WrappedComponent.name})`;

        return RoleGuard;
    };
}
