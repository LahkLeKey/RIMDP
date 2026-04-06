import { FormEvent, useMemo, useState } from "react";
import { useAddReading, useCreateRepair, useFailures, useUpdateRepair } from "../../hooks/useApi";

export const RepairWorkflowPage = () => {
    const failuresQuery = useFailures();
    const createRepairMutation = useCreateRepair();
    const updateRepairMutation = useUpdateRepair();
    const addReadingMutation = useAddReading();

    const failures = useMemo(() => failuresQuery.data ?? [], [failuresQuery.data]);
    const latestRepair = failures.flatMap((f: any) => f.repairs ?? []).sort((a: any, b: any) =>
        b.startedAt.localeCompare(a.startedAt)
    )[0];

    const [failureId, setFailureId] = useState("");
    const [technician, setTechnician] = useState("A. Patel");
    const [notes, setNotes] = useState("Initial troubleshooting started.");

    const [status, setStatus] = useState<"PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED">("IN_PROGRESS");
    const [repairId, setRepairId] = useState("");
    const [metric, setMetric] = useState("Pressure Stability");
    const [value, setValue] = useState(0.95);
    const [unit, setUnit] = useState("score");
    const [passed, setPassed] = useState(true);

    const createRepair = (event: FormEvent) => {
        event.preventDefault();
        createRepairMutation.mutate({ failureId, technician, notes, status });
    };

    const updateRepair = (event: FormEvent) => {
        event.preventDefault();
        if (!repairId) {
            return;
        }

        updateRepairMutation.mutate({
            repairId,
            payload: {
                status,
                notes
            }
        });
    };

    const addStepReading = (event: FormEvent) => {
        event.preventDefault();
        const targetRepairId = repairId || latestRepair?.id;

        if (!targetRepairId) {
            return;
        }

        addReadingMutation.mutate({
            repairId: targetRepairId,
            payload: { metric, value, unit, passed }
        });
    };

    return (
        <div className="grid">
            <section className="card">
                <h2>Create Repair Log</h2>
                <form className="grid" onSubmit={createRepair}>
                    <select value={failureId} onChange={(event) => setFailureId(event.target.value)}>
                        <option value="">Select failure</option>
                        {failures.map((failure: any) => (
                            <option key={failure.id} value={failure.id}>
                                {failure.symptoms} ({failure.severity})
                            </option>
                        ))}
                    </select>
                    <input value={technician} onChange={(event) => setTechnician(event.target.value)} placeholder="Technician" />
                    <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Repair notes" />
                    <button type="submit">{createRepairMutation.isPending ? "Creating..." : "Create Repair"}</button>
                </form>
            </section>

            <section className="card">
                <h2>Update Workflow Status</h2>
                <form className="grid" onSubmit={updateRepair}>
                    <input
                        value={repairId}
                        onChange={(event) => setRepairId(event.target.value)}
                        placeholder="Repair ID (optional: uses latest if blank for readings only)"
                    />
                    <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="FAILED">FAILED</option>
                    </select>
                    <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} />
                    <button type="submit">{updateRepairMutation.isPending ? "Updating..." : "Update Repair"}</button>
                </form>
            </section>

            <section className="card">
                <h2>Step Logging (Test Readings)</h2>
                <form className="form-grid" onSubmit={addStepReading}>
                    <input value={metric} onChange={(event) => setMetric(event.target.value)} placeholder="Metric" />
                    <input value={unit} onChange={(event) => setUnit(event.target.value)} placeholder="Unit" />
                    <input
                        type="number"
                        step="0.01"
                        value={value}
                        onChange={(event) => setValue(Number(event.target.value))}
                        placeholder="Value"
                    />
                    <select value={String(passed)} onChange={(event) => setPassed(event.target.value === "true")}>
                        <option value="true">Pass</option>
                        <option value="false">Fail</option>
                    </select>
                    <button style={{ gridColumn: "span 2" }} type="submit">
                        {addReadingMutation.isPending ? "Saving..." : "Add Reading"}
                    </button>
                </form>
            </section>
        </div>
    );
};