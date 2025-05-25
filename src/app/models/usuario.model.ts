export interface Usuario {
  id: number;
  nombre: string;
  edad: number;
  cargo: string;
  fechaIngreso: string;
}

export interface UsuarioRequest {
  nombre: string;
  edad: number;
  cargo: string;
  fechaIngreso: string;
}

export enum Cargo {
  ASESOR_VENTAS = 'Asesor de ventas',
  ADMINISTRADOR = 'Administrador',
  SOPORTE = 'Soporte'
}