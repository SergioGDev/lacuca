import { Component, Input, OnInit } from '@angular/core';
import { ItemPreguntaRespondida } from '../../interfaces/data.interface';

@Component({
  selector: 'app-item-pregunta-con-solucion',
  templateUrl: './item-pregunta-con-solucion.component.html',
  styleUrls: ['./item-pregunta-con-solucion.component.css']
})
export class ItemPreguntaConSolucionComponent implements OnInit {

  @Input() item!: ItemPreguntaRespondida;
  @Input() numeroPregunta!: number;

  constructor() { }

  ngOnInit(): void {
  }

}
