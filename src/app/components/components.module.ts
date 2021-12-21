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
    DialogEliminarVideoComponent
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
    LoadCsvComponent,
    UsersFromCsvComponent,
    ModalVideoComponent,
    VideoCardComponent
  ]
})
export class ComponentsModule { }
