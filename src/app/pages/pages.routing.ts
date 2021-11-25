import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';

import { AuthGuard } from '../guards/auth.guard';
import { ZonaTestsComponent } from './zona-tests/zona-tests.component';
import { DesignacionesComponent } from './designaciones/designaciones.component';
import { JugadasComponent } from './jugadas/jugadas.component';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';
import { NuevoTestComponent } from './nuevo-test/nuevo-test.component';
import { SolucionTestComponent } from './solucion-test/solucion-test.component';

const routes: Routes = [
  { 
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: 'inicio', component: DashboardComponent, data: { titulo: 'Dashboard' } },
      { path: 'tests', component: ZonaTestsComponent, data: { titulo: 'Zona tests ' } },
      { path: 'designaciones', component: DesignacionesComponent, data: { titulo: 'Designaciones' } },
      { path: 'jugadas', component: JugadasComponent, data: { titulo: 'Jugadas' } },
      { path: 'listado-usuarios', component: ListadoUsuariosComponent, data: {titulo: 'Listado de usuarios' } },
      { path: 'nuevo-test', component: NuevoTestComponent, data: {titulo: 'Nuevo test' } },
      { path: 'solucion-test', component: SolucionTestComponent, data: {titulo: 'Solución test'} },
      { path: '**', redirectTo: 'inicio' },
    ]

  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PagesRoutingModule { }
