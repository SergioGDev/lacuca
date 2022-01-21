import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { ComponentsModule } from '../components/components.module';

import { RolPipe } from '../pipes/rol.pipe';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DatosPartidoComponent } from './datos-partido/datos-partido.component';
import { DesignacionesComponent } from './designaciones/designaciones.component';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';
import { NuevoTestComponent } from './nuevo-test/nuevo-test.component';
import { PagesComponent } from './pages.component';
import { RegistrarNuevoPartidoComponent } from './registrar-nuevo-partido/registrar-nuevo-partido.component';
import { SharedModule } from '../shared/shared.module';
import { SolucionTestComponent } from './solucion-test/solucion-test.component';
import { ListadoPartidosComponent } from './listado-partidos/listado-partidos.component';
import { ZonaTestsComponent } from './zona-tests/zona-tests.component';
import { RegistrarNuevoCorteComponent } from './registrar-nuevo-corte/registrar-nuevo-corte.component';
import { PanelAdministracionVideotestComponent } from './panel-administracion-videotest/panel-administracion-videotest.component';
import { RegistrarNuevoVideotestComponent } from './registrar-nuevo-videotest/registrar-nuevo-videotest.component';

@NgModule({
  declarations: [
    DashboardComponent,
    
    DatosPartidoComponent,
    DesignacionesComponent,
    ListadoPartidosComponent,
    ListadoUsuariosComponent,
    NuevoTestComponent,
    PagesComponent,
    RegistrarNuevoCorteComponent,
    RegistrarNuevoPartidoComponent,
    RolPipe,
    SolucionTestComponent,
    ZonaTestsComponent,
    PanelAdministracionVideotestComponent,
    RegistrarNuevoVideotestComponent,
  ],
  exports: [
    DashboardComponent,
    PagesComponent,
    ListadoUsuariosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FormsModule,

    YouTubePlayerModule,
    
    AngularMaterialModule,
    ComponentsModule,
    SharedModule,
  ]
})
export class PagesModule { }
