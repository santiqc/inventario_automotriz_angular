import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MercanciaDto, MercanciaRequest } from '../models/mercancia.model';
import { Observable } from 'rxjs';
import { Cargo, CargoDto, Usuario, UsuarioRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class MercanciaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  registrarMercancia(mercancia: MercanciaRequest): Observable<MercanciaDto> {
    return this.http.post<MercanciaDto>(`${this.apiUrl}/mercancias`, mercancia);
  }

  editarMercancia(id: number, mercancia: MercanciaRequest, usuarioModificadorId: number): Observable<MercanciaDto> {
    const params = new HttpParams().set('usuarioModificadorId', usuarioModificadorId.toString());
    return this.http.put<MercanciaDto>(`${this.apiUrl}/mercancias/${id}`, mercancia, { params });
  }

  eliminarMercancia(id: number, usuarioId: number): Observable<void> {
    const params = new HttpParams().set('usuarioId', usuarioId.toString());
    return this.http.delete<void>(`${this.apiUrl}/mercancias/${id}`, { params });
  }

  buscarMercancias(nombre?: string, usuarioId?: number, fecha?: string, mercanciaId?: number): Observable<MercanciaDto[]> {
    let params = new HttpParams();

    if (nombre && nombre.trim()) {
      params = params.set('nombre', nombre.trim());
    }
    if (usuarioId && usuarioId > 0) {
      params = params.set('usuarioId', usuarioId.toString());
    }
    if (fecha && fecha.trim()) {
      params = params.set('fecha', fecha.trim());
    }
    if (mercanciaId && mercanciaId > 0) {
      params = params.set('mercanciaId', mercanciaId.toString());
    }


    return this.http.get<MercanciaDto[]>(`${this.apiUrl}/mercancias`, { params });
  }


  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  obtenerUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`);
  }

  crearUsuario(usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }

  actualizarUsuario(id: number, usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }

  obtenerCargos(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(`${this.apiUrl}/usuarios/cargos`);
  }

  crearCargo(cargo: CargoDto): Observable<Cargo> {
    return this.http.post<Cargo>(`${this.apiUrl}/usuarios/cargos/crear`, cargo);
  }

  eliminarCargo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/cargos/${id}`);
  }
}
