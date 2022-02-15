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
import { DataPartidoComponent } from './data-partido/data-partido.component';
import { DialogConfirmarComponent } from './dialog-confirmar/dialog-confirmar.component';
import { DialogEliminarComponent } from './dialog-eliminar/dialog-eliminar.component';
import { DialogModificarComponent } from './dialog-modificar/dialog-modificar.component';
import { DialogVerCorteComponent } from './dialog-ver-corte/dialog-ver-corte.component';
import { ItemPreguntaComponent } from './item-pregunta/item-pregunta.component';
import { ItemPreguntaConSolucionComponent } from './item-pregunta-con-solucion/item-pregunta-con-solucion.component';
import { ListadoCortesComponent } from './listado-cortes/listado-cortes.component';
import { ListadoDatosPartidoComponent } from './listado-datos-partido/listado-datos-partido.component';
import { LoadCsvComponent } from './load-csv/load-csv.component';
import { ModalVideoComponent } from './modal-video/modal-video.component';
import { PartidosFromCsvComponent } from './partidos-from-csv/partidos-from-csv.component';
import { SpinnerCargandoComponent } from './spinner-cargando/spinner-cargando.component';
import { UsersFromCsvComponent } from './users-from-csv/users-from-csv.component';
import { VisualizadorDatosCorteComponent } from './visualizador-datos-corte/visualizador-datos-corte.component';
import { YtPlayerCorteComponent } from './yt-player-corte/yt-player-corte.component';
import { DialogRegistrarComponent } from './dialog-registrar/dialog-registrar.component';
import { ListadoSeleccionPartidoComponent } from './listado-seleccion-partido/listado-seleccion-partido.component';
import { BuscadorCortesRegistroInformeComponent } from './buscador-cortes-registro-informe/buscador-cortes-registro-informe.component';
import { DialogRegistrarInformeComponent } from './dialog-registrar-informe/dialog-registrar-informe.component';
import { ListadoInformesComponent } from './listado-informes/listado-informes.component';
import { ListadoSeleccionCortesInformesComponent } from './listado-seleccion-cortes-informes/listado-seleccion-cortes-informes.component';
import { ListadoVideotestsComponent } from './listado-videotests/listado-videotests.component';
import { DataUsuariosComponent } from './data-usuarios/data-usuarios.component';
import { TarjetaDatosUsuarioComponent } from './tarjeta-datos-usuario/tarjeta-datos-usuario.component';


@NgModule({
  declarations: [
    BuscadorCortesComponent,
    ChangePasswordComponent,
    CreateUserComponent,
    CuadroDatosPartidoComponent,
    DataPartidoComponent,
    DialogConfirmarComponent,
    DialogModificarComponent,
    DialogEliminarComponent,
    DialogRegistrarComponent,
    DialogVerCorteComponent,
    ItemPreguntaComponent,
    ItemPreguntaConSolucionComponent,
    ListadoCortesComponent,
    ListadoDatosPartidoComponent,
    LoadCsvComponent,
    ModalVideoComponent,
    PartidosFromCsvComponent,
    SpinnerCargandoComponent,
    VisualizadorDatosCorteComponent,
    UsersFromCsvComponent,
    YtPlayerCorteComponent,
    ListadoSeleccionPartidoComponent,
    BuscadorCortesRegistroInformeComponent,
    DialogRegistrarInformeComponent,
    ListadoInformesComponent,
    ListadoSeleccionCortesInformesComponent,
    ListadoVideotestsComponent,
    DataUsuariosComponent,
    TarjetaDatosUsuarioComponent,
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
    BuscadorCortesRegistroInformeComponent,
    ChangePasswordComponent,
    CreateUserComponent,
    CuadroDatosPartidoComponent,
    DataPartidoComponent,
    DataUsuariosComponent,
    TarjetaDatosUsuarioComponent,
    ItemPreguntaComponent,
    ItemPreguntaConSolucionComponent,
    ListadoDatosPartidoComponent, 
    ListadoInformesComponent,
    ListadoSeleccionPartidoComponent,
    ListadoSeleccionCortesInformesComponent,
    ListadoCortesComponent,
    ListadoVideotestsComponent,
    LoadCsvComponent,
    PartidosFromCsvComponent,
    ModalVideoComponent,
    UsersFromCsvComponent,
    VisualizadorDatosCorteComponent,
    SpinnerCargandoComponent,
    YtPlayerCorteComponent,
  ]
})
export class ComponentsModule { }
