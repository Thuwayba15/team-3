import { redirect } from "next/navigation";

/** Root path redirects to the login page as the authenticated entry point. */
export default function RootPage() {
    redirect("/login");
}
