import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MercanciaService } from '../../services/mercancia.service';
import { MercanciaDto } from '../../models/mercancia.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-mercancia-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mercancia-list.component.html',
  styleUrl: './mercancia-list.component.css'
})
export class MercanciaListComponent implements OnInit {
  mercancias: MercanciaDto[] = [];
  usuarios: Usuario[] = [];
  cargando = false;

  filtros = {
    nombre: '',
    usuarioId: '',
    fecha: ''
  };

  mercanciaAEliminar: MercanciaDto | null = null;
  usuarioEliminarId: number | null = null;

  constructor(
    private mercanciaService: MercanciaService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.buscarMercancias();
  }

  cargarUsuarios() {
    this.mercanciaService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (error) => {
        this.toastr.error('Error al cargar usuarios:');
      }
    });
  }

  buscarMercancias() {

    // if (!this.filtros.nombre.trim() && !this.filtros.usuarioId && !this.filtros.fecha) {
    //   this.toastr.warning('Debe especificar al menos un filtro de búsqueda');
    //   return;
    // }

    this.cargando = true;
    this.mercanciaService.buscarMercancias(
      this.filtros.nombre || undefined,
      this.filtros.usuarioId ? +this.filtros.usuarioId : undefined,
      this.filtros.fecha || undefined
    ).subscribe({
      next: (mercancias) => {
        this.mercancias = mercancias;
        this.cargando = false;
        if (mercancias.length === 0) {
          this.toastr.info('No se encontraron mercancías con los filtros especificados');
        }
      },
      error: (error) => {
        this.cargando = false;
        this.toastr.error('Error al buscar mercancías:');
      }
    });
  }

  limpiarFiltros() {
    this.filtros = {
      nombre: '',
      usuarioId: '',
      fecha: ''
    };
    this.buscarMercancias();
  }

  confirmarEliminar(mercancia: MercanciaDto) {
    this.mercanciaAEliminar = mercancia;
    this.usuarioEliminarId = null;
  }

  cancelarEliminar() {
    this.mercanciaAEliminar = null;
    this.usuarioEliminarId = null;
  }

  eliminarMercancia() {
    if (!this.mercanciaAEliminar || !this.usuarioEliminarId) {
      return;
    }

    this.mercanciaService.eliminarMercancia(this.mercanciaAEliminar.id!, this.usuarioEliminarId).subscribe({
      next: () => {
        this.toastr.success('Mercancía eliminada exitosamente');
        this.cancelarEliminar();
        this.buscarMercancias();
      },
      error: (error) => {
        ;
        this.toastr.error(error.error.error || 'Error desconocido', 'Error al eliminar mercancía:');
      }
    });
  }
}