import { NavLink, Outlet, createBrowserRouter } from "react-router-dom";
import { AnalyticsPage } from "./features/analytics/AnalyticsPage";
import { DashboardPage } from "./features/analytics/DashboardPage";
import { EquipmentPage } from "./features/equipment/EquipmentPage";
import { FailureReportPage } from "./features/failures/FailureReportPage";
import { RepairWorkflowPage } from "./features/repairs/RepairWorkflowPage";
import { AuthPanel } from "./components/AuthPanel";

const RootLayout = () => {
    return (
        <div className="app-shell">
            <header className="app-header">
                <h1>RIMDP</h1>
                <nav className="app-nav">
                    <NavLink to="/" end>
                        Dashboard
                    </NavLink>
                    <NavLink to="/equipment">Equipment</NavLink>
                    <NavLink to="/failures/report">Report Failure</NavLink>
                    <NavLink to="/repairs">Repairs</NavLink>
                    <NavLink to="/analytics">Analytics</NavLink>
                </nav>
            </header>
            <main className="app-main">
                <AuthPanel />
                <Outlet />
            </main>
        </div>
    );
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <DashboardPage /> },
            { path: "equipment", element: <EquipmentPage /> },
            { path: "failures/report", element: <FailureReportPage /> },
            { path: "repairs", element: <RepairWorkflowPage /> },
            { path: "analytics", element: <AnalyticsPage /> }
        ]
    }
]);