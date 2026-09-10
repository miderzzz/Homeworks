import { useState, useRef, useEffect } from "react";
import { CircularLinkedList } from "../clases/listEnlaceCircular";
import { doctores } from "../data/datosDoctores";
import type { Doctor } from "../data/datosDoctores";
import type { CircularNode } from "../clases/nodeCircular";

function RotacionDeDoctores() {
  const listaDoctoresRef = useRef<CircularLinkedList<Doctor> | null>(null);
  if (!listaDoctoresRef.current) {
    const lista = new CircularLinkedList<Doctor>();
    doctores.forEach((doctor) => lista.append(doctor));
    listaDoctoresRef.current = lista;
  }
  const list = listaDoctoresRef.current;
  const [currentNode, setCurrentNode] = useState<CircularNode<Doctor> | null>(list.head);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNode((prev) => (prev ? prev.next : list.head))}, 10000);
    return () => clearInterval(interval);
  }, [list]);
  return (
    <div style={{ border: "4px dashed #444", borderRadius: "8px", padding: "16px" }}>
      <h3>Medico de Guardia</h3>
      {currentNode ? (
        <div> <p style={{ fontSize: "20px" }}>{currentNode.value.nombre}</p>
          <p style={{ color: "#030303", fontWeight: "bold" }}>{currentNode.value.especialidad}</p>
        </div>
      ) : (
        <p>No hay médicos registrados.</p>
      )}
    </div>
  );
}
export default RotacionDeDoctores;