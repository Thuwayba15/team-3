import {
    BarChartOutlined,
    BookOutlined,
    CompassOutlined,
    DashboardOutlined,
    RobotOutlined,
    UserOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import type { RoleNavigationMap } from "@/types/navigation";

export const NAVIGATION_BY_ROLE: RoleNavigationMap = {
    student: [
        { key: "student-dashboard", label: "Dashboard", path: "/student/dashboard", icon: DashboardOutlined },
        { key: "student-learning-path", label: "Learning Path", path: "/student/learning-path", icon: CompassOutlined },
        { key: "student-progress", label: "Progress", path: "/student/progress", icon: BarChartOutlined },
        { key: "student-ai-tutor", label: "Ask AI", path: "/student/ai-tutor", icon: RobotOutlined },
        { key: "student-language", label: "Language", path: "/student/settings", icon: GlobalOutlined },
    ],
    tutor: [],
    parent: [],
    admin: [
        { key: "admin-dashboard", label: "Dashboard", path: "/admin/dashboard", icon: DashboardOutlined },
        { key: "admin-users", label: "Users", path: "/admin/users", icon: UserOutlined },
        { key: "admin-curriculum", label: "Curriculum", path: "/admin/curriculum", icon: BookOutlined },
        { key: "admin-ai-configuration", label: "AI Prompts", path: "/admin/ai-configuration", icon: RobotOutlined },
    ],
};
