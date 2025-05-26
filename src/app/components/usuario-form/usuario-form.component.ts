import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MercanciaService } from '../../services/mercancia.service';
import { Cargo, Usuario, UsuarioRequest } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm: FormGroup;
  cargos: Cargo[] = [];
  esEdicion = false;
  guardando = false;
  intentoEnvio = false;
  fechaMaxima: string;
  usuarioId: number | null = null;
  usuarioOriginal: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private mercanciaService: MercanciaService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.fechaMaxima = new Date().toISOString().split('T')[0];

    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      edad: [null, [Validators.required, Validators.min(18), Validators.max(99)]],
      cargoId: ['', [Validators.required]],
      fechaIngreso: ['', [Validators.required, this.fechaMaximaValidator.bind(this)]]
    });
  }

  ngOnInit() {
    this.cargarCargos();
    this.verificarModoEdicion();
  }

  fechaMaximaValidator(control: any) {
    if (!control.value) return null;

    const fechaIngresada = new Date(control.value);
    const fechaActual = new Date();
    fechaActual.setHours(23, 59, 59, 999);

    return fechaIngresada > fechaActual ? { max: true } : null;
  }

  cargarCargos() {
    this.mercanciaService.obtenerCargos().subscribe({
      next: (cargos) => {
        this.cargos = cargos;
      },
      error: (error) => {
        this.toastr.error('Error al cargar la lista de cargos');
      }
    });
  }

  verificarModoEdicion() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.usuarioId = +id;
      this.cargarUsuario();
    }
  }

  cargarUsuario() {
    if (!this.usuarioId) return;

    this.mercanciaService.obtenerUsuario(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuarioOriginal = usuario;
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          edad: usuario.edad,
          cargoId: usuario.cargoId,
          fechaIngreso: usuario.fechaIngreso
        });
      },
      error: (error) => {
        this.toastr.error('Error al cargar los datos del usuario');
        this.router.navigate(['/usuarios']);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.usuarioForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.intentoEnvio));
  }

  onSubmit() {
    this.intentoEnvio = true;

    if (this.usuarioForm.invalid) {
      this.toastr.warning('Por favor, corrija los errores en el formulario');
      this.markAllFieldsAsTouched();
      return;
    }

    const usuarioData: UsuarioRequest = this.usuarioForm.value;
    this.guardando = true;

    if (this.esEdicion) {
      this.actualizarUsuario(usuarioData);
    } else {
      this.crearUsuario(usuarioData);
    }
  }

  crearUsuario(usuarioData: UsuarioRequest) {
    this.mercanciaService.crearUsuario(usuarioData).subscribe({
      next: (response) => {
        this.toastr.success('Usuario creado exitosamente');
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        this.guardando = false;
        this.toastr.error('Error al crear el usuario');
      }
    });
  }

  actualizarUsuario(usuarioData: UsuarioRequest) {
    if (!this.usuarioId) return;

    this.mercanciaService.actualizarUsuario(this.usuarioId, usuarioData).subscribe({
      next: (response) => {
        this.toastr.success('Usuario actualizado exitosamente');
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        this.guardando = false;
        this.toastr.error('Error al actualizar el usuario');
      }
    });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      control?.markAsTouched();
    });
  }
}