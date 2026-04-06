import { SimpleBarChart } from "../../components/SimpleBarChart";
import { StatCard } from "../../components/StatCard";
import { useAnalytics } from "../../hooks/useApi";

export const DashboardPage = () => {
    const { data, isLoading } = useAnalytics();

    if (isLoading || !data) {
        return <p>Loading dashboard...</p>;
    }

    return (
        <div className="grid">
            <section className="grid grid-3">
                <StatCard label="Total Equipment" value={String(data.dashboard.totalEquipment)} />
                <StatCard label="Failure Count" value={String(data.dashboard.totalFailures)} />
                <StatCard
                    label="Repair Success Rate"
                    value={`${(data.dashboard.repairSuccessRate * 100).toFixed(1)}%`}
                />
            </section>

            <SimpleBarChart
                title="Failure Trend (14 days)"
                data={data.failureTrends.map((point) => ({ label: point.day.slice(5), value: point.count }))}
            />

            <SimpleBarChart
                title="Recurring Issues"
                data={data.recurringIssues.map((item) => ({ label: item.symptoms, value: item.count }))}
            />
        </div>
    );
};