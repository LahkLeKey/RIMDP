import { FormEvent, useMemo, useState } from "react";
import { useCreateFailure, useEquipmentList } from "../../hooks/useApi";

export const FailureReportPage = () => {
    const { data: equipment } = useEquipmentList();
    const createFailureMutation = useCreateFailure();

    const defaultEquipmentId = equipment?.[0]?.id ?? "";

    const [equipmentId, setEquipmentId] = useState(defaultEquipmentId);
    const [severity, setSeverity] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
    const [symptoms, setSymptoms] = useState("Signal dropout");
    const [description, setDescription] = useState("Pressure value intermittently drops to 0 under load.");

    const equipmentOptions = useMemo(() => equipment ?? [], [equipment]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!equipmentId) {
            return;
        }

        createFailureMutation.mutate({
            equipmentId,
            severity,
            symptoms,
            description
        });
    };

    return (
        <section className="card">
            <h2>Failure Reporting</h2>
            <form className="grid" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <select value={equipmentId} onChange={(event) => setEquipmentId(event.target.value)}>
                        <option value="">Select equipment</option>
                        {equipmentOptions.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name} ({item.serialNumber})
                            </option>
                        ))}
                    </select>

                    <select value={severity} onChange={(event) => setSeverity(event.target.value as typeof severity)}>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                    </select>
                </div>

                <input value={symptoms} onChange={(event) => setSymptoms(event.target.value)} placeholder="Symptoms" />
                <textarea
                    rows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Description"
                />

                <button type="submit">{createFailureMutation.isPending ? "Submitting..." : "Report Failure"}</button>
            </form>
        </section>
    );
};