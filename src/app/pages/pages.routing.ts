import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';

import { AuthGuard } from '../guards/auth.guard';

import { DatosPartidoComponent } from './datos-partido/datos-partido.component';
import { DesignacionesComponent } from './designaciones/designaciones.component';
import { ListadoPartidosComponent } from './listado-partidos/listado-partidos.component';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';
import { ZonaTestsComponent } from './zona-tests/zona-tests.component';
import { NuevoTestComponent } from './nuevo-test/nuevo-test.component';
import { RegistrarNuevoVideotestComponent } from './registrar-nuevo-videotest/registrar-nuevo-videotest.component';
import { SolucionTestComponent } from './solucion-test/solucion-test.component';
import { PanelAdministracionVideotestComponent } from './panel-administracion-videotest/panel-administracion-videotest.component';
import { RegistrarNuevoCorteComponent } from './registrar-nuevo-corte/registrar-nuevo-corte.component';
import { RegistrarNuevoPartidoComponent } from './registrar-nuevo-partido/registrar-nuevo-partido.component';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
import { CreateUserComponent } from '../components/create-user/create-user.component';
import { IsAdminGuard } from '../guards/is-admin.guard';
import { RegistrarNuevoUsuarioComponent } from './registrar-nuevo-usuario/registrar-nuevo-usuario.component';
import { RegistrarPartidosCsvComponent } from './registrar-partidos-csv/registrar-partidos-csv.component';
import { InformesComponent } from './informes/informes.component';
import { RegistrarNuevoInformeComponent } from './registrar-nuevo-informe/registrar-nuevo-informe.component';
import { RegistrarUsuariosCsvComponent } from './registrar-usuarios-csv/registrar-usuarios-csv.component';
import { RealizarInformeComponent } from './realizar-informe/realizar-informe.component';
import { VisualizarDatosInformeComponent } from './visualizar-datos-informe/visualizar-datos-informe.component';
import { VisualizarVideotestComponent } from './visualizar-videotest/visualizar-videotest.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'inicio', component: DashboardComponent, data: { titulo: 'Dashboard' } },
      { path: 'zona-tests', component: ZonaTestsComponent, data: { titulo: 'Zona tests' } },
      { path: 'zona-tests/nuevo-test', component: NuevoTestComponent, data: { titulo: 'Nuevo test' } },
      { path: 'zona-tests/solucion-test', component: SolucionTestComponent, data: { titulo: 'Solución test' } },
      { path: 'zona-tests/admin-videotest', component: PanelAdministracionVideotestComponent, data: { titulo: 'Panel Administración Videotest' } },
      { path: 'zona-tests/admin-videotest/registrar-nuevo-videotest', component: RegistrarNuevoVideotestComponent, data: { titulo: 'Registrar Nuevo Videotest' } },
      { path: 'zona-tests/admin-videotest/ver-videotest', component: VisualizarVideotestComponent, data: { titulo: 'Ver Videotest' } },
      { path: 'designaciones', component: DesignacionesComponent, data: { titulo: 'Designaciones' } },
      { path: 'partidos', component: ListadoPartidosComponent, data: { titulo: 'Partidos' } },
      { path: 'partidos/partido', component: DatosPartidoComponent, data: { titulo: 'Datos partido' } },
      { path: 'partidos/registrar-nuevo-partido', component: RegistrarNuevoPartidoComponent, data: { titulo: 'Nuevo partido' } },
      { path: 'partidos/registrar-listado-partidos', component: RegistrarPartidosCsvComponent, data: { titulo: 'Registrar listado de partidos' } },
      { path: 'partidos/modificar-partido', component: RegistrarNuevoPartidoComponent, data: { titulo: 'Modificar partido' } },
      { path: 'partidos/partido/nuevo-corte', component: RegistrarNuevoCorteComponent, data: { titulo: 'Nuevo corte' } },
      { path: 'partidos/partido/modificar-corte', component: RegistrarNuevoCorteComponent, data: { titulo: 'Modificar corte' } },
      { path: 'informes', component: InformesComponent, data: { titulo: 'Informes' } },
      { path: 'informes/nuevo-informe', component: RegistrarNuevoInformeComponent, data: { titulo: 'Nuevo informe' } },
      { path: 'informes/modificar-informe', component: RegistrarNuevoInformeComponent, data: { titulo: 'Modificar informe' } },
      { path: 'informes/realizar-informe', component: RealizarInformeComponent, data: { titulo: 'Realizar informe' } },
      { path: 'informes/realizar-informe/nuevo-corte', component: RegistrarNuevoCorteComponent, data: { titulo: 'Nuevo corte' } },
      { path: 'informes/ver-informe', component: VisualizarDatosInformeComponent, data: { titulo: 'Ver informe' } },
      { path: 'listado-usuarios', component: ListadoUsuariosComponent, canActivate: [IsAdminGuard], canLoad: [IsAdminGuard], data: { titulo: 'Listado de usuarios' } },
      { path: 'listado-usuarios/editar-usuario', component: RegistrarNuevoUsuarioComponent, canActivate: [IsAdminGuard], canLoad: [IsAdminGuard], data: { titulo: 'Editar datos del usuario' } },
      { path: 'listado-usuarios/registrar-listado-usuarios', component: RegistrarUsuariosCsvComponent, canActivate: [IsAdminGuard], canLoad: [IsAdminGuard], data: { titulo: 'Registrar listado de usuarios' } },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'editar-mis-datos', component: CreateUserComponent },
      { path: '**', redirectTo: 'inicio' },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
