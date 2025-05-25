import { Routes } from '@angular/router';
import { MercanciaListComponent } from './components/mercancia-list/mercancia-list.component';
import { MercanciaFormComponent } from './components/mercancia-form/mercancia-form.component';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/mercancias', pathMatch: 'full' },
  { path: 'mercancias', component: MercanciaListComponent },
  { path: 'mercancias/nueva', component: MercanciaFormComponent },
  { path: 'mercancias/editar/:id', component: MercanciaFormComponent },
  { path: 'usuarios', component: UsuarioListComponent },
  { path: '**', redirectTo: '/mercancias' }
];