import { useAnalytics } from "../../hooks/useApi";

export const AnalyticsPage = () => {
    const { data, isLoading } = useAnalytics();

    if (isLoading || !data) {
        return <p>Loading analytics...</p>;
    }

    return (
        <div className="grid">
            <section className="card">
                <h2>Failure Trends</h2>
                <ul>
                    {data.failureTrends.map((point) => (
                        <li key={point.day}>
                            {point.day}: {point.count}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="card">
                <h2>Recurring Issues</h2>
                <ul>
                    {data.recurringIssues.map((issue) => (
                        <li key={issue.symptoms}>
                            {issue.symptoms} ({issue.count})
                        </li>
                    ))}
                </ul>
            </section>

            <section className="card">
                <h2>Recommendations</h2>
                <div className="grid">
                    {data.recommendations.map((rec) => (
                        <article key={rec.equipmentId} className="card">
                            <h3>{rec.recommendation}</h3>
                            <p>{rec.reason}</p>
                            <p>Failure Rate: {rec.failureRate}</p>
                            <p>Repair Success Rate: {(rec.repairSuccessRate * 100).toFixed(1)}%</p>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
};