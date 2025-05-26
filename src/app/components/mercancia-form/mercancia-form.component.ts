import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MercanciaService } from '../../services/mercancia.service';
import { MercanciaDto, MercanciaRequest } from '../../models/mercancia.model';
import { Usuario } from '../../models/usuario.model';
@Component({
  selector: 'app-mercancia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './mercancia-form.component.html',
  styleUrl: './mercancia-form.component.css'
})
export class MercanciaFormComponent implements OnInit {
  mercanciaForm: FormGroup;
  usuarios: Usuario[] = [];
  esEdicion = false;
  guardando = false;
  intentoEnvio = false;
  fechaMaxima: string;
  mercanciaId: number | null = null;
  usuarioModificadorId: number | null = null;
  mercanciaOriginal: MercanciaDto | null = null;

  constructor(
    private fb: FormBuilder,
    private mercanciaService: MercanciaService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {

    this.fechaMaxima = new Date().toISOString().split('T')[0];

    this.mercanciaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      fechaIngreso: ['', [Validators.required, this.fechaMaximaValidator.bind(this)]],
      usuarioId: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.cargarUsuarios();
    this.verificarModoEdicion();
  }

  fechaMaximaValidator(control: any) {
    if (!control.value) return null;

    const fechaIngresada = new Date(control.value);
    const fechaActual = new Date();
    fechaActual.setHours(23, 59, 59, 999);

    return fechaIngresada > fechaActual ? { max: true } : null;
  }

  cargarUsuarios() {
    this.mercanciaService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (error) => {
        this.toastr.error('Error al cargar la lista de usuarios');
      }
    });
  }

  verificarModoEdicion() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.mercanciaId = +id;
      this.cargarMercancia();
    }
  }

  cargarMercancia() {
    if (!this.mercanciaId) return;

    this.mercanciaService.buscarMercancias(undefined, undefined, undefined, this.mercanciaId).subscribe({
      next: (mercancias) => {
        const mercancia = mercancias[0];
        this.mercanciaOriginal = mercancia;
        this.mercanciaForm.patchValue({
          nombre: mercancia.nombre,
          cantidad: mercancia.cantidad,
          fechaIngreso: mercancia.fechaIngreso,
          usuarioId: mercancia.usuarioId
        });
      },
      error: (error) => {
        this.toastr.error('Error al cargar los datos de la mercancía');
        this.router.navigate(['/mercancias']);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.mercanciaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.intentoEnvio));
  }

  onSubmit() {
    this.intentoEnvio = true;

    if (this.mercanciaForm.invalid) {
      this.toastr.warning('Por favor, corrija los errores en el formulario');
      this.markAllFieldsAsTouched();
      return;
    }

    if (this.esEdicion && !this.usuarioModificadorId) {
      this.toastr.warning('Debe seleccionar el usuario que modifica');
      return;
    }

    const mercanciaData: MercanciaRequest = this.mercanciaForm.value;
    this.guardando = true;

    if (this.esEdicion) {
      this.actualizarMercancia(mercanciaData);
    } else {
      this.crearMercancia(mercanciaData);
    }
  }

  crearMercancia(mercanciaData: MercanciaRequest) {
    this.mercanciaService.registrarMercancia(mercanciaData).subscribe({
      next: (response) => {
        this.toastr.success('Mercancía creada exitosamente');
        this.router.navigate(['/mercancias']);
      },
      error: (error) => {
        this.guardando = false;
        this.toastr.error(error.error.error || 'Error desconocido', 'Error al crear mercancía:');
      }
    });
  }

  actualizarMercancia(mercanciaData: MercanciaRequest) {
    if (!this.mercanciaId || !this.usuarioModificadorId) return;

    this.mercanciaService.editarMercancia(
      this.mercanciaId,
      mercanciaData,
      this.usuarioModificadorId
    ).subscribe({
      next: (response) => {
        this.toastr.success('Mercancía actualizada exitosamente');
        this.router.navigate(['/mercancias']);
      },
      error: (error) => {
        this.guardando = false;
         this.toastr.error(error.error.error || 'Error desconocido', 'Error al actualizar mercancía:');
      }
    });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.mercanciaForm.controls).forEach(key => {
      const control = this.mercanciaForm.get(key);
      control?.markAsTouched();
    });
  }
}