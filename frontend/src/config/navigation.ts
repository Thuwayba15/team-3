import {
    AlertOutlined,
    BarChartOutlined,
    BookOutlined,
    CompassOutlined,
    DashboardOutlined,
    GlobalOutlined,
    QuestionCircleOutlined,
    RobotOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import type { RoleNavigationMap } from "@/types/navigation";

export const NAVIGATION_BY_ROLE: RoleNavigationMap = {
    student: [
        { key: "student-dashboard", label: "Dashboard", path: "/student/dashboard", icon: DashboardOutlined },
        { key: "student-learning-path", label: "Learning Path", path: "/student/learning-path", icon: CompassOutlined },
        { key: "student-lessons", label: "Lessons", path: "/student/lessons", icon: BookOutlined },
        { key: "student-quizzes", label: "Quizzes", path: "/student/quizzes", icon: QuestionCircleOutlined },
        { key: "student-ai-tutor", label: "AI Tutor", path: "/student/ai-tutor", icon: RobotOutlined },
        { key: "student-progress", label: "Progress", path: "/student/progress", icon: BarChartOutlined },
        { key: "student-settings", label: "Settings", path: "/student/settings", icon: SettingOutlined },
    ],
    tutor: [
        { key: "tutor-dashboard", label: "Dashboard", path: "/tutor/dashboard", icon: DashboardOutlined },
        { key: "tutor-students", label: "Students", path: "/tutor/students", icon: TeamOutlined },
        { key: "tutor-interventions", label: "Interventions", path: "/tutor/interventions", icon: AlertOutlined },
        { key: "tutor-learning-modules", label: "Learning Modules", path: "/tutor/learning-modules", icon: BookOutlined },
        { key: "tutor-analytics", label: "Analytics", path: "/tutor/analytics", icon: BarChartOutlined },
    ],
    parent: [
        { key: "parent-dashboard", label: "Dashboard", path: "/parent/dashboard", icon: DashboardOutlined },
        { key: "parent-child-progress", label: "Child Progress", path: "/parent/child-progress", icon: BarChartOutlined },
        { key: "parent-alerts", label: "Alerts", path: "/parent/alerts", icon: AlertOutlined },
    ],
    admin: [
        { key: "admin-dashboard", label: "Dashboard", path: "/admin/dashboard", icon: DashboardOutlined },
        { key: "admin-users", label: "Users", path: "/admin/users", icon: UserOutlined },
        { key: "admin-languages", label: "Languages", path: "/admin/languages", icon: GlobalOutlined },
        { key: "admin-curriculum", label: "Curriculum", path: "/admin/curriculum", icon: BookOutlined },
        { key: "admin-ai-configuration", label: "AI Configuration", path: "/admin/ai-configuration", icon: RobotOutlined },
    ],
};
