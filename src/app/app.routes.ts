import { Routes } from '@angular/router';
import { MercanciaListComponent } from './components/mercancia-list/mercancia-list.component';
import { MercanciaFormComponent } from './components/mercancia-form/mercancia-form.component';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { UsuarioFormComponent } from './components/usuario-form/usuario-form.component';
import { CargoManagementComponent } from './components/cargo-management/cargo-management.component';

export const routes: Routes = [
  { path: '', redirectTo: '/mercancias', pathMatch: 'full' },
  { path: 'mercancias', component: MercanciaListComponent },
  { path: 'mercancias/nueva', component: MercanciaFormComponent },
  { path: 'mercancias/editar/:id', component: MercanciaFormComponent },
  { path: 'usuarios', component: UsuarioListComponent },
  { path: 'usuarios/nuevo', component: UsuarioFormComponent },
  { path: 'usuarios/editar/:id', component: UsuarioFormComponent },
  { path: 'cargos', component: CargoManagementComponent },
  { path: '**', redirectTo: '/mercancias' }
];