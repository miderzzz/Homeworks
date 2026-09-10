import type {Paciente} from "../data/datosPacientes";

export interface pacienteAtendido {
    paciente: Paciente;
    fechaAtencion: Date;
}
interface Props {
    historial: pacienteAtendido[];
}

function Historial({ historial }: Props) {
    return (
        <div style={{ border: "4px dashed #444", borderRadius: "8px", padding: "16px" }}>
            <h2 style={{ borderRadius: "5%", padding: "16px", color: "#000", fontWeight: "bold" }}>Historial de Pacientes Atendidos</h2>
            {historial.length === 0 ? (
                <p>No hay pacientes atendidos.</p>
            ) : (
                <ul style={{ listStyleType: "circle", padding: 0 }}>
                    {historial.map((numero, index) => (
                        <li key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "8px" }}>
                            <span><strong>Nombre:</strong> {numero.paciente.nombreCompleto} - {numero.paciente.motivo}</span><br />
                            <span><strong>Fecha de Atención:</strong> {numero.fechaAtencion.toLocaleDateString()}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Historial;