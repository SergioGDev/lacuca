import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { AngularMaterialModule } from '../angular-material/angular-material.module';

import { BuscadorCortesComponent } from './buscador-cortes/buscador-cortes.component';
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
import { DialogVerCorteComponent } from './dialog-ver-corte/dialog-ver-corte.component';
import { DialogModificarUsuarioComponent } from './dialog-modificar-usuario/dialog-modificar-usuario.component';
import { CustomToastComponent } from './custom-toast/custom-toast.component';
import { DialogConfirmarUsuarioModificadoComponent } from './dialog-confirmar-usuario-modificado/dialog-confirmar-usuario-modificado.component';
import { DialogConfirmarErrorComponent } from './dialog-confirmar-error/dialog-confirmar-error.component';


@NgModule({
  declarations: [
    BuscadorCortesComponent,
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
    DialogVerCorteComponent,
    DialogModificarUsuarioComponent,
    CustomToastComponent,
    DialogConfirmarUsuarioModificadoComponent,
    DialogConfirmarErrorComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    YouTubePlayerModule
  ],
  exports: [
    BuscadorCortesComponent,
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
