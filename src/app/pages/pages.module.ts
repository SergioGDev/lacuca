import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ZonaTestsComponent } from './zona-tests/zona-tests.component';
import { DesignacionesComponent } from './designaciones/designaciones.component';
import { JugadasComponent } from './jugadas/jugadas.component';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';
import { RolPipe } from '../pipes/rol.pipe';
import { NuevoTestComponent } from './nuevo-test/nuevo-test.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SolucionTestComponent } from './solucion-test/solucion-test.component';

@NgModule({
  declarations: [
    DashboardComponent,
    
    PagesComponent,
    ZonaTestsComponent,
    DesignacionesComponent,
    JugadasComponent,
    ListadoUsuariosComponent,
    RolPipe,
    NuevoTestComponent,
    SolucionTestComponent
  ],
  exports: [
    DashboardComponent,
    PagesComponent
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
