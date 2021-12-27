import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

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
import { VideosComponent } from './videos/videos.component';
import { ZonaTestsComponent } from './zona-tests/zona-tests.component';

@NgModule({
  declarations: [
    DashboardComponent,
    
    DatosPartidoComponent,
    DesignacionesComponent,
    ListadoUsuariosComponent,
    NuevoTestComponent,
    PagesComponent,
    RegistrarNuevoPartidoComponent,
    RolPipe,
    SolucionTestComponent,
    VideosComponent,
    ZonaTestsComponent,
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
    
    AngularMaterialModule,
    ComponentsModule,
    SharedModule,
  ]
})
export class PagesModule { }
