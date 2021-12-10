import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPreguntaComponent } from './item-pregunta/item-pregunta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemPreguntaConSolucionComponent } from './item-pregunta-con-solucion/item-pregunta-con-solucion.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';



@NgModule({
  declarations: [
    ItemPreguntaComponent,
    ItemPreguntaConSolucionComponent,
    CreateUserComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ItemPreguntaComponent,
    ItemPreguntaConSolucionComponent,
    CreateUserComponent,
    ChangePasswordComponent
  ]
})
export class ComponentsModule { }
