import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPreguntaComponent } from './item-pregunta/item-pregunta.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ItemPreguntaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ItemPreguntaComponent
  ]
})
export class ComponentsModule { }
