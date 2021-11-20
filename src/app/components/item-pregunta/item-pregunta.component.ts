import { Component, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ItemPregunta } from '../../interfaces/data.interface';

@Component({
  selector: 'app-item-pregunta',
  templateUrl: './item-pregunta.component.html',
  styles: [
  ]
})
export class ItemPreguntaComponent {

  @Input() pregunta!: ItemPregunta;
  @Input() numeroPregunta!: number;

  constructor( ) { }

  getFormControlName() {
    return `pregunta-${this.numeroPregunta}`;
  }

  getIdRespuesta(numeroRespuesta: number) {
    return `pregunta-${this.numeroPregunta}-respuesta-${numeroRespuesta}`;
  }
}
