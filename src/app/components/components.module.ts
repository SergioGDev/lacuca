import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { AngularMaterialModule } from '../angular-material/angular-material.module';

import { ChangePasswordComponent } from './change-password/change-password.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { CuadroDatosPartidoComponent } from './cuadro-datos-partido/cuadro-datos-partido.component';
import { DialogEliminarCorteComponent } from './dialog-eliminar-corte/dialog-eliminar-corte.component';
import { DialogEliminarVideoComponent } from './dialog-eliminar-video/dialog-eliminar-video.component';
import { DialogModificarCorteComponent } from './dialog-modificar-corte/dialog-modificar-corte.component';
import { DialogModificarPartidoComponent } from './dialog-modificar-partido/dialog-modificar-partido.component';
import { DialogNuevoCorteComponent } from './dialog-nuevo-corte/dialog-nuevo-corte.component';
import { DialogNuevoPartidoComponent } from './dialog-nuevo-partido/dialog-nuevo-partido.component';
import { ItemPreguntaComponent } from './item-pregunta/item-pregunta.component';
import { ItemPreguntaConSolucionComponent } from './item-pregunta-con-solucion/item-pregunta-con-solucion.component';
import { ListadoCortesComponent } from './listado-cortes/listado-cortes.component';
import { ListadoVideosComponent } from './listado-videos/listado-videos.component';
import { LoadCsvComponent } from './load-csv/load-csv.component';
import { ModalVideoComponent } from './modal-video/modal-video.component';
import { PartidosFromCsvComponent } from './partidos-from-csv/partidos-from-csv.component';
import { SpinnerCargandoComponent } from './spinner-cargando/spinner-cargando.component';
import { UsersFromCsvComponent } from './users-from-csv/users-from-csv.component';
import { VideoCardComponent } from './video-card/video-card.component';
import { VisualizadorDatosCorteComponent } from './visualizador-datos-corte/visualizador-datos-corte.component';


@NgModule({
  declarations: [
    ChangePasswordComponent,
    CreateUserComponent,
    CuadroDatosPartidoComponent,
    DialogEliminarCorteComponent,
    DialogEliminarVideoComponent,
    DialogModificarPartidoComponent,
    DialogModificarCorteComponent,
    DialogNuevoCorteComponent,
    DialogNuevoPartidoComponent,
    ItemPreguntaComponent,
    ItemPreguntaConSolucionComponent,
    ListadoCortesComponent,
    ListadoVideosComponent,
    LoadCsvComponent,
    ModalVideoComponent,
    PartidosFromCsvComponent,
    SpinnerCargandoComponent,
    VideoCardComponent,
    VisualizadorDatosCorteComponent,
    UsersFromCsvComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    YouTubePlayerModule
  ],
  exports: [
    ChangePasswordComponent,
    CreateUserComponent,
    CuadroDatosPartidoComponent,
    ItemPreguntaComponent,
    ItemPreguntaConSolucionComponent,
    ListadoVideosComponent, 
    ListadoCortesComponent,
    LoadCsvComponent,
    PartidosFromCsvComponent,
    ModalVideoComponent,
    UsersFromCsvComponent,
    VideoCardComponent,
    VisualizadorDatosCorteComponent,
    SpinnerCargandoComponent,
  ]
})
export class ComponentsModule { }
