import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';

import { AuthGuard } from '../guards/auth.guard';
import { ZonaTestsComponent } from './zona-tests/zona-tests.component';
import { DesignacionesComponent } from './designaciones/designaciones.component';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';
import { NuevoTestComponent } from './nuevo-test/nuevo-test.component';
import { SolucionTestComponent } from './solucion-test/solucion-test.component';
import { VideosComponent } from './videos/videos.component';
import { RegistrarNuevoPartidoComponent } from './registrar-nuevo-partido/registrar-nuevo-partido.component';

const routes: Routes = [
  { 
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: 'inicio', component: DashboardComponent, data: { titulo: 'Dashboard' } },
      { path: 'zona-tests', component: ZonaTestsComponent, data: { titulo: 'Zona tests ' } },
      { path: 'designaciones', component: DesignacionesComponent, data: { titulo: 'Designaciones' } },
      { path: 'videos', component: VideosComponent, data: { titulo: 'Videos' } },
      { path: 'videos/registrar-nuevo-partido', component: RegistrarNuevoPartidoComponent, data: { titulo: 'Nuevo partido' } },
      { path: 'listado-usuarios', component: ListadoUsuariosComponent, data: {titulo: 'Listado de usuarios' } },
      { path: 'zona-tests/nuevo-test', component: NuevoTestComponent, data: {titulo: 'Nuevo test' } },
      { path: 'zona-tests/solucion-test', component: SolucionTestComponent, data: {titulo: 'Solución test'} },
      { path: '**', redirectTo: 'inicio' },
    ]

  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PagesRoutingModule { }