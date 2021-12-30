import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPreguntaComponent } from './item-pregunta/item-pregunta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemPreguntaConSolucionComponent } from './item-pregunta-con-solucion/item-pregunta-con-solucion.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoadCsvComponent } from './load-csv/load-csv.component';
import { UsersFromCsvComponent } from './users-from-csv/users-from-csv.component';
import { ModalVideoComponent } from './modal-video/modal-video.component';
import { VideoCardComponent } from './video-card/video-card.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogEliminarVideoComponent } from './dialog-eliminar-video/dialog-eliminar-video.component';
import { ListadoVideosComponent } from './listado-videos/listado-videos.component';
import { DialogNuevoPartidoComponent } from './dialog-nuevo-partido/dialog-nuevo-partido.component';
import { DialogModificarPartidoComponent } from './dialog-modificar-partido/dialog-modificar-partido.component';
import { CuadroDatosPartidoComponent } from './cuadro-datos-partido/cuadro-datos-partido.component';
import { ListadoCortesComponent } from './listado-cortes/listado-cortes.component';
import { DialogEliminarCorteComponent } from './dialog-eliminar-corte/dialog-eliminar-corte.component';
import { DialogModificarCorteComponent } from './dialog-modificar-corte/dialog-modificar-corte.component';
import { DialogNuevoCorteComponent } from './dialog-nuevo-corte/dialog-nuevo-corte.component';



@NgModule({
  declarations: [
    ItemPreguntaComponent,
    ItemPreguntaConSolucionComponent,
    CreateUserComponent,
    ChangePasswordComponent,
    LoadCsvComponent,
    UsersFromCsvComponent,
    ModalVideoComponent,
    VideoCardComponent,
    DialogEliminarVideoComponent,
    ListadoVideosComponent,
    DialogNuevoPartidoComponent,
    DialogModificarPartidoComponent,
    CuadroDatosPartidoComponent,
    ListadoCortesComponent,
    DialogEliminarCorteComponent,
    DialogModificarCorteComponent,
    DialogNuevoCorteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule
  ],
  exports: [
    ItemPreguntaComponent,
    ItemPreguntaConSolucionComponent,
    CreateUserComponent,
    ChangePasswordComponent,
    ListadoVideosComponent, 
    LoadCsvComponent,
    UsersFromCsvComponent,
    ModalVideoComponent,
    VideoCardComponent,
    CuadroDatosPartidoComponent
  ]
})
export class ComponentsModule { }
