import { Usuario } from "./usuario.model";

export interface MercanciaDto {
  id?: number;
  nombre: string;
  cantidad: number;
  fechaIngreso: string;
  usuarioId: number;
  usuarioRegistro?: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
}

export interface MercanciaRequest {
  nombre: string;
  cantidad: number;
  fechaIngreso: string;
  usuarioId: number;
}