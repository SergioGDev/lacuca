import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPreguntaComponent } from './item-pregunta/item-pregunta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemPreguntaConSolucionComponent } from './item-pregunta-con-solucion/item-pregunta-con-solucion.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoadCsvComponent } from './load-csv/load-csv.component';
import { UsersFromCsvComponent } from './users-from-csv/users-from-csv.component';



@NgModule({
  declarations: [
    ItemPreguntaComponent,
    ItemPreguntaConSolucionComponent,
    CreateUserComponent,
    ChangePasswordComponent,
    LoadCsvComponent,
    UsersFromCsvComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ItemPreguntaComponent,
    ItemPreguntaConSolucionComponent,
    CreateUserComponent,
    ChangePasswordComponent,
    LoadCsvComponent,
    UsersFromCsvComponent
  ]
})
export class ComponentsModule { }
