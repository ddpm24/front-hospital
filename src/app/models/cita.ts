import { Doctor } from "./doctor";
import { Usuario } from "./usuario";

export interface Cita {
    id: number;
    fecha: string;
    email: string;
    telefono: string;
    motivo: string;
    tarifa: number;
	formaPago: string;
    estado: string;
    visto: number;
    usuario: Usuario;
    doctor: Doctor;
}
