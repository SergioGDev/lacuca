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
import { PartidosComponent } from './partidos/partidos.component';
import { RegistrarNuevoPartidoComponent } from './registrar-nuevo-partido/registrar-nuevo-partido.component';
import { DatosPartidoComponent } from './datos-partido/datos-partido.component';
import { NuevoCorteComponent } from './nuevo-corte/nuevo-corte.component';

const routes: Routes = [
  { 
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: 'inicio', component: DashboardComponent, data: { titulo: 'Dashboard' } },
      { path: 'zona-tests', component: ZonaTestsComponent, data: { titulo: 'Zona tests ' } },
      { path: 'designaciones', component: DesignacionesComponent, data: { titulo: 'Designaciones' } },
      { path: 'partidos', component: PartidosComponent, data: { titulo: 'Partidos' } },
      { path: 'partidos/partido', component: DatosPartidoComponent, data: { titulo: 'Datos partido'} },
      { path: 'partidos/registrar-nuevo-partido', component: RegistrarNuevoPartidoComponent, data: { titulo: 'Nuevo partido' } },
      { path: 'partidos/modificar-partido', component: RegistrarNuevoPartidoComponent, data: { titulo: 'Modificar partido' } },
      { path: 'partidos/partido/nuevo-corte', component: NuevoCorteComponent, data: { titulo: 'Nuevo corte' } },
      { path: 'partidos/partido/modificar-corte', component: NuevoCorteComponent, data: { titulo: 'Modificar corte' } },
      { path: 'listado-usuarios', component: ListadoUsuariosComponent, data: { titulo: 'Listado de usuarios' } },
      { path: 'zona-tests/nuevo-test', component: NuevoTestComponent, data: { titulo: 'Nuevo test' } },
      { path: 'zona-tests/solucion-test', component: SolucionTestComponent, data: { titulo: 'Solución test' } },
      { path: '**', redirectTo: 'inicio' },
    ]

  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PagesRoutingModule { }
