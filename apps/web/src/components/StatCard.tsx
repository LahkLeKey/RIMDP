type StatCardProps = {
    label: string;
    value: string;
};

export const StatCard = ({ label, value }: StatCardProps) => (
    <section className="card">
        <p>{label}</p>
        <h2>{value}</h2>
    </section>
);