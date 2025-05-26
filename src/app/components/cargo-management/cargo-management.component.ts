import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MercanciaService } from '../../services/mercancia.service';
import { Cargo, CargoDto } from '../../models/usuario.model';

@Component({
  selector: 'app-cargo-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cargo-management.component.html',
  styleUrl: './cargo-management.component.css'
})
export class CargoManagementComponent implements OnInit {
  cargos: Cargo[] = [];
  cargoForm: FormGroup;
  cargando = false;
  guardando = false;
  cargoAEliminar: Cargo | null = null;

  constructor(
    private fb: FormBuilder,
    private mercanciaService: MercanciaService,
    private toastr: ToastrService
  ) {
    this.cargoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  ngOnInit() {
    this.cargarCargos();
  }

  cargarCargos() {
    this.cargando = true;
    this.mercanciaService.obtenerCargos().subscribe({
      next: (cargos) => {
        this.cargos = cargos;
        this.cargando = false;
      },
      error: (error) => {
        this.cargando = false;
        this.toastr.error('Error al cargar la lista de cargos');
      }
    });
  }

  onSubmit() {
    if (this.cargoForm.invalid) {
      this.cargoForm.markAllAsTouched();
      return;
    }

    const cargoData: CargoDto = this.cargoForm.value;
    
    const existeCargo = this.cargos.some(cargo => 
      cargo.nombre.toLowerCase() === cargoData.nombre.toLowerCase()
    );

    if (existeCargo) {
      this.toastr.warning('Ya existe un cargo con ese nombre');
      return;
    }

    this.guardando = true;
    this.mercanciaService.crearCargo(cargoData).subscribe({
      next: (response) => {
        this.toastr.success('Cargo creado exitosamente');
        this.cargoForm.reset();
        this.cargarCargos();
        this.guardando = false;
      },
      error: (error) => {
        this.guardando = false;
        this.toastr.error('Error al crear el cargo');
      }
    });
  }

  confirmarEliminar(cargo: Cargo) {
    this.cargoAEliminar = cargo;
  }

  cancelarEliminar() {
    this.cargoAEliminar = null;
  }

  eliminarCargo() {
    if (!this.cargoAEliminar?.id) {
      return;
    }

    this.mercanciaService.eliminarCargo(this.cargoAEliminar.id).subscribe({
      next: () => {
        this.toastr.success('Cargo eliminado exitosamente');
        this.cancelarEliminar();
        this.cargarCargos();
      },
      error: (error) => {
        this.toastr.error('Error al eliminar el cargo. Puede que tenga usuarios asociados.');
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.cargoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}