import type { RoleNavigationMap } from "@/types/navigation";
import {
    AlertOutlined,
    BarChartOutlined,
    BookOutlined,
    CompassOutlined,
    DashboardOutlined,
    RobotOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";

export const NAVIGATION_BY_ROLE: RoleNavigationMap = {
    student: [
        { key: "student-dashboard", label: "nav.dashboard", path: "/student/dashboard", icon: DashboardOutlined },
        { key: "student-learning-path", label: "nav.learningPath", path: "/student/learning-path", icon: CompassOutlined },
        { key: "student-lessons", label: "nav.lessons", path: "/student/lessons", icon: BookOutlined },
        // { key: "student-progress", label: "nav.progress", path: "/student/progress", icon: BarChartOutlined },
    ],
    tutor: [
        { key: "tutor-dashboard", label: "nav.dashboard", path: "/tutor/dashboard", icon: DashboardOutlined },
        { key: "tutor-students", label: "nav.students", path: "/tutor/students", icon: TeamOutlined },
        { key: "tutor-interventions", label: "nav.interventions", path: "/tutor/interventions", icon: AlertOutlined },
        { key: "tutor-learning-modules", label: "nav.learningModules", path: "/tutor/learning-modules", icon: BookOutlined },
        { key: "tutor-analytics", label: "nav.analytics", path: "/tutor/analytics", icon: BarChartOutlined },
    ],
    parent: [
        { key: "parent-dashboard", label: "nav.dashboard", path: "/parent/dashboard", icon: DashboardOutlined },
        { key: "parent-child-progress", label: "nav.childProgress", path: "/parent/child-progress", icon: BarChartOutlined },
        { key: "parent-alerts", label: "nav.alerts", path: "/parent/alerts", icon: AlertOutlined },
    ],
    admin: [
        { key: "admin-dashboard", label: "nav.dashboard", path: "/admin/dashboard", icon: DashboardOutlined },
        { key: "admin-users", label: "nav.users", path: "/admin/users", icon: UserOutlined },
        { key: "admin-curriculum", label: "nav.curriculum", path: "/admin/curriculum", icon: BookOutlined },
        { key: "admin-ai-configuration", label: "nav.aiConfiguration", path: "/admin/ai-configuration", icon: RobotOutlined },
    ],
};
