type BarDatum = {
    label: string;
    value: number;
};

type SimpleBarChartProps = {
    title: string;
    data: BarDatum[];
};

export const SimpleBarChart = ({ title, data }: SimpleBarChartProps) => {
    const max = Math.max(...data.map((item) => item.value), 1);

    return (
        <section className="card">
            <h3>{title}</h3>
            <div className="grid">
                {data.map((item) => (
                    <div className="chart-row" key={item.label}>
                        <span>{item.label}</span>
                        <div className="chart-bar" style={{ width: `${(item.value / max) * 100}%` }} />
                        <strong>{item.value}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
};