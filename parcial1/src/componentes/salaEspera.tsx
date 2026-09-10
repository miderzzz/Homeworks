import type {Paciente} from "../data/datosPacientes";
interface Props {
    pacientes: Paciente[];
    onAttend: (paciente: Paciente) => void;
}
function SalaDeEspera({ pacientes, onAttend }: Props) {
    return (
        <div>
            <h2 style={{ border: "5px solid #b00d0d", borderRadius: "5%", padding: "16px", color: "#000", fontWeight: "bold" }}>Sala de Espera</h2>

            {pacientes.length === 0 ? (
                <p>No hay pacientes en espera.</p>
            ) : (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {pacientes.map((paciente, index) => (
                        <li key={paciente.id}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #ccc"}}>
                            <span>{paciente.nombreCompleto} - {paciente.motivo}</span>
                            {index === 0 ?(
                                <button onClick={() => onAttend(paciente)}>Atender</button>
                            ) : (
                                <span style={{ color: "black", fontWeight: "bold" }}>En espera</span>
                            )}
                            
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )} export default SalaDeEspera;