import { useState } from "react";
import { useEquipmentDetail, useEquipmentList } from "../../hooks/useApi";

export const EquipmentPage = () => {
    const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | undefined>(undefined);
    const equipmentQuery = useEquipmentList();
    const detailQuery = useEquipmentDetail(selectedEquipmentId);

    if (equipmentQuery.isLoading) {
        return <p>Loading equipment...</p>;
    }

    return (
        <div className="grid">
            <section className="card">
                <h2>Equipment</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Model</th>
                            <th>Status</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipmentQuery.data?.map((equipment) => (
                            <tr key={equipment.id} onClick={() => setSelectedEquipmentId(equipment.id)}>
                                <td>{equipment.name}</td>
                                <td>{equipment.model}</td>
                                <td>{equipment.status}</td>
                                <td>{equipment.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="card">
                <h2>Details & Timeline</h2>
                {!selectedEquipmentId && <p>Select an equipment row to view details.</p>}
                {selectedEquipmentId && detailQuery.isLoading && <p>Loading detail...</p>}

                {detailQuery.data && (
                    <div className="grid">
                        <p>
                            <strong>{detailQuery.data.name}</strong> ({detailQuery.data.serialNumber})
                        </p>
                        <p>Components: {detailQuery.data.components.map((c) => c.pcbReference).join(", ")}</p>
                        <div className="timeline">
                            {detailQuery.data.failures.map((failure) => (
                                <div className="timeline-item" key={failure.id}>
                                    <p>
                                        <strong>{failure.severity}</strong> - {failure.symptoms}
                                    </p>
                                    <p>{failure.description}</p>
                                    {failure.repairs.map((repair) => (
                                        <p key={repair.id}>
                                            Repair {repair.id.slice(0, 8)}: {repair.status} ({repair.technician})
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};