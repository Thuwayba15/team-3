import type { RoleNavigationMap } from "@/types/navigation";
import {
    AlertOutlined,
    BarChartOutlined,
    BookOutlined,
    CompassOutlined,
    DashboardOutlined,
    MessageOutlined,
    TeamOutlined,
    RobotOutlined,
    VideoCameraOutlined,
    UserOutlined
} from "@ant-design/icons";

export const NAVIGATION_BY_ROLE: RoleNavigationMap = {
    student: [
        { key: "student-dashboard", label: "nav.dashboard", path: "/student/dashboard", icon: DashboardOutlined },
        { key: "student-learning-path", label: "nav.learningPath", path: "/student/learning-path", icon: CompassOutlined },
        { key: "student-lessons", label: "nav.lessons", path: "/student/lessons", icon: BookOutlined },
        { key: "student-available-tutors", label: "nav.availableTutors", path: "/student/available-tutors", icon: TeamOutlined },
        { key: "student-tutors", label: "nav.tutors", path: "/student/tutors", icon: MessageOutlined },
        // { key: "student-progress", label: "nav.progress", path: "/student/progress", icon: BarChartOutlined },
    ],
    tutor: [
        { key: "tutor-dashboard", label: "nav.dashboard", path: "/tutor/dashboard", icon: DashboardOutlined },
        { key: "tutor-meetings", label: "nav.meetings", path: "/tutor/meetings", icon: VideoCameraOutlined },
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
