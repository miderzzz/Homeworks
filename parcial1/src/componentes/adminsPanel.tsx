import { useState, useRef } from "react";
import { CircularDoubleLinkedList } from "../clases/listEnlaceDobleCircular";
import { admins } from "../data/datosAdmins";
import type { Admin } from "../data/datosAdmins";
import type { DoubleNode } from "../clases/dobleNode";

function AdminsPanel() {
  const listaAdminsRef = useRef<CircularDoubleLinkedList<Admin> | null>(null);

  if (!listaAdminsRef.current) {
    const lista = new CircularDoubleLinkedList<Admin>();
    admins.forEach((miembro) => lista.append(miembro));
    listaAdminsRef.current = lista;
  }

  const list = listaAdminsRef.current;
  const [currentNode, setCurrentNode] = useState<DoubleNode<Admin> | null>(list.head);

  const handleNext = () => {
    if (currentNode) setCurrentNode(currentNode.next);
  };

  const handlePrev = () => {
    if (currentNode) setCurrentNode(currentNode.prev);
  };

  return (
    <div style={{ border: "4px dashed #444", borderRadius: "8px", padding: "16px" }}>
      <h3>Comité Administrativo</h3>

      {currentNode ? (
        <div>
          <p style={{ fontSize: "20px" }}>{currentNode.value.nombre}</p>
          <p style={{ color: "#882828" }}>{currentNode.value.rol}</p>
        </div>
      ) : (
        <p>No hay miembros registrados.</p>
      )}
      <button onClick={handlePrev}>+- Anterior</button>
      <button onClick={handleNext} style={{ marginLeft: "10px" }}>
        Siguiente -+
      </button>
    </div>
  );
}

export default AdminsPanel;