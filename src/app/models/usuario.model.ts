export interface Usuario {
  id: number;
  nombre: string;
  edad: number;
  cargo: string;
  cargoId: number;
  fechaIngreso: string;
}

export interface UsuarioRequest {
  nombre: string;
  edad: number;
  cargoId: number;
  fechaIngreso: string;
}

export  interface Cargo {
  nombre: string;
  id: number;
}