export interface Doctor {
    id: number;
    nombre: string;
    especialidad: string;
    consultorio: number;
}

export const doctores: Doctor[] = [
    { id: 1, nombre: "Dr. Carlos Pérez", especialidad: "Cardiología", consultorio: 101 },
    { id: 2, nombre: "Dr. Fermin López", especialidad: "Pediatría", consultorio: 102 },
    { id: 3, nombre: "Dr. Falcao García", especialidad: "Dermatología", consultorio: 103 },
    { id: 4, nombre: "Dr. Fernando Torres", especialidad: "Ginecología", consultorio: 104 }]