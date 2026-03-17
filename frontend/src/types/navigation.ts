import type { ComponentType } from "react";

export type AppRole = "student" | "tutor" | "parent" | "admin";

export interface IRoleOption {
    label: string;
    value: AppRole;
}

export interface INavigationItem {
    key: string;
    label: string;
    path: string;
    icon: ComponentType;
}

export type RoleNavigationMap = Record<AppRole, INavigationItem[]>;
