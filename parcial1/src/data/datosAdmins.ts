export interface Admin {
    id: number;
    nombre: string;
    rol: string;
}

export const admins: Admin[] = [
    { id: 1, nombre: "Pablo Barrios", rol: "Administrador" },
    { id: 2, nombre: "Mapi Leon", rol: "Moderador" },
    { id: 3, nombre: "Frenkie de Jong", rol: "Supervisor" }]