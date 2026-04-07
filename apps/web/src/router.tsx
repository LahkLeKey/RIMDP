import { NavLink, Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { AnalyticsPage } from "./features/analytics/AnalyticsPage";
import { DashboardPage } from "./features/analytics/DashboardPage";
import { EquipmentPage } from "./features/equipment/EquipmentPage";
import { FailureReportPage } from "./features/failures/FailureReportPage";
import { RepairWorkflowPage } from "./features/repairs/RepairWorkflowPage";
import { UserPage } from "./features/user/UserPage";
import { AppAuthGuard } from "./components/AppAuthGuard";

const RootLayout = () => {
    return (
        <div className="app-shell">
            <header className="app-header">
                <h1>RIMDP</h1>
                <nav className="app-nav">
                    <NavLink to="/dashboard">
                        Dashboard
                    </NavLink>
                    <NavLink to="/equipment">Equipment</NavLink>
                    <NavLink to="/failures/report">Report Failure</NavLink>
                    <NavLink to="/repairs">Repairs</NavLink>
                    <NavLink to="/analytics">Analytics</NavLink>
                    <NavLink to="/user">User</NavLink>
                </nav>
            </header>
            <main className="app-main"><Outlet /></main>
        </div>
    );
};

const ProtectedLayout = () => (
    <AppAuthGuard>
        <Outlet />
    </AppAuthGuard>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <Navigate to="/user" replace /> },
            {
                element: <ProtectedLayout />,
                children: [
                    { path: "dashboard", element: <DashboardPage /> },
                    { path: "equipment", element: <EquipmentPage /> },
                    { path: "failures/report", element: <FailureReportPage /> },
                    { path: "repairs", element: <RepairWorkflowPage /> },
                    { path: "analytics", element: <AnalyticsPage /> }
                ]
            },
            { path: "user", element: <UserPage /> }
        ]
    }
]);