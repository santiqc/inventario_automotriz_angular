import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MercanciaService } from '../../services/mercancia.service';
import { Cargo, Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css'
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  cargos: Cargo[] = [];
  cargando = false;

  filtros = {
    nombre: '',
    cargo: null as string | null,
    edad: null as number | null
  };

  usuarioAEliminar: Usuario | null = null;

  constructor(
    private mercanciaService: MercanciaService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarCargos();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.mercanciaService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = usuarios;
        this.cargando = false;
      },
      error: (error) => {
        this.cargando = false;
        this.toastr.error('Error al cargar la lista de usuarios');
      }
    });
  }

  cargarCargos() {
    this.mercanciaService.obtenerCargos().subscribe({
      next: (cargos) => {
        this.cargos = cargos;
      },
      error: (error) => {
        this.toastr.error(error.error.error || 'Error desconocido', 'Error al cargar cargos:');
      }
    });
  }

  aplicarFiltros() {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const coincideNombre = !this.filtros.nombre.trim() ||
        usuario.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase());

      const coincideCargo = !this.filtros.cargo ||
        usuario.cargo === this.filtros.cargo;

      const coincideEdad = !this.filtros.edad ||
        usuario.edad === this.filtros.edad;

      return coincideNombre && coincideCargo && coincideEdad;
    });

    if (this.usuariosFiltrados.length === 0 && this.usuarios.length > 0) {
      this.toastr.info('No se encontraron usuarios con los filtros especificados');
    }
  }

  limpiarFiltros() {
    this.filtros = {
      nombre: '',
      cargo: null,
      edad: null
    };
    this.usuariosFiltrados = this.usuarios;
  }

  editarUsuario(id: number) {
    this.router.navigate(['/usuarios/editar', id]);
  }

  confirmarEliminar(usuario: Usuario) {
    this.usuarioAEliminar = usuario;
  }

  cancelarEliminar() {
    this.usuarioAEliminar = null;
  }

  eliminarUsuario() {
    if (!this.usuarioAEliminar?.id) {
      return;
    }

    this.mercanciaService.eliminarUsuario(this.usuarioAEliminar.id).subscribe({
      next: () => {
        this.toastr.success('Usuario eliminado exitosamente');
        this.cancelarEliminar();
        this.cargarUsuarios();
      },
      error: (error) => {
        this.toastr.error('Error al eliminar el usuario. Puede que tenga mercancías asociadas.');
      }
    });
  }

  calcularAntiguedad(fechaIngreso: string): number {
    const fecha = new Date(fechaIngreso);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fecha.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25));
  }
}