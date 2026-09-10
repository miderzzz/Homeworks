export interface Paciente {
    nombreCompleto: string;
    id: string;
    edad: number;
    motivo: string;
}
export const pacientes: Paciente[] = [
    { nombreCompleto: "Juan Pérez", id: "12345678", edad: 30, motivo: "Dolor de cabeza" },
    { nombreCompleto: "Marlon Torres", id: "87654321", edad: 25, motivo: "Fiebre" },
    { nombreCompleto: "Carlos Sanchez", id: "45678912", edad: 40, motivo: "Dolor de estómago" },
    { nombreCompleto: "Ana Paralluello", id: "98765432", edad: 35, motivo: "Tos persistente" },
    { nombreCompleto: "Enzo Fernández", id: "23456789", edad: 28, motivo: "Dolor de espalda" },
    { nombreCompleto: "Lautaro Martínez", id: "34567890", edad: 32, motivo: "Mareos" }]