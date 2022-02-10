import { Component, Input } from '@angular/core';

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
