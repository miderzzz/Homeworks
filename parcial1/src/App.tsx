import { useState, useRef } from "react";
import { LinkedList } from "./clases/linkedList";
import { DoubleLinkedList } from "./clases/dobleEnlace";
import { pacientes } from "./data/datosPacientes";
import type { Paciente } from "./data/datosPacientes";
import SalaEspera from "./componentes/salaEspera";
import Historial from "./componentes/historial";
import RotacionDeDoctores from "./componentes/rotacionDoctores";
import AdminsPanel from "./componentes/adminsPanel";
import type { pacienteAtendido } from "./componentes/historial";

function App() {
  const listaPacientesRef = useRef<LinkedList<Paciente> | null>(null);
  const listaHistorialRef = useRef<DoubleLinkedList<pacienteAtendido> | null>(null);

  if (!listaPacientesRef.current) {
    const lista = new LinkedList<Paciente>();
    pacientes.forEach((p) => lista.append(p));
    listaPacientesRef.current = lista;
  }
  if (!listaHistorialRef.current) {
    listaHistorialRef.current = new DoubleLinkedList<pacienteAtendido>();
  }

  const [listaEspera, setListaEspera] = useState<Paciente[]>(listaPacientesRef.current.toArray());
  const [historial, setHistorial] = useState<pacienteAtendido[]>([]);

  const handleAtender = () => {
    const atendido = listaPacientesRef.current!.removeFirst();
    if (!atendido) return;

    const registro: pacienteAtendido = {
      paciente: atendido,
      fechaAtencion: new Date(),
    };
    listaHistorialRef.current!.append(registro);

    setListaEspera(listaPacientesRef.current!.toArray());
    setHistorial(listaHistorialRef.current!.toArray());
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', fontFamily: 'sans-serif', display: 'grid', gap: '20px' }}>
      <h1 style={{ textAlign: "center", fontFamily: "monospace", fontSize: "60px", color: "#0049c8", fontWeight: "bold" }}>Sistema de Gestión Clínica</h1>

      <SalaEspera pacientes={listaEspera} onAttend={handleAtender} />
      <Historial historial={historial} />
      <RotacionDeDoctores />
      <AdminsPanel />
    </div>
  );
}

export default App;