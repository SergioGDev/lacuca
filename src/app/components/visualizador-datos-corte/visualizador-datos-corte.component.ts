import { Component, Input, OnInit } from '@angular/core';
import { DatosCorte } from '../../interfaces/data.interface';

@Component({
  selector: 'app-visualizador-datos-corte',
  templateUrl: './visualizador-datos-corte.component.html',
  styleUrls: ['./visualizador-datos-corte.component.css']
})
export class VisualizadorDatosCorteComponent implements OnInit {

  @Input() corte!: DatosCorte;

  constructor() { }

  ngOnInit(): void {
  }


  
  // ************************************************** //
  // ********      FUNCIONES DE TAMAÑO          ******* //
  // ************************************************** //
  getFxFlexVideo(corte: DatosCorte) {
    return (corte.valoracion ? 60 : 100);
  }

  getYoutubePlayerWidth() {
    return window.innerWidth > 500 ? 500 : window.innerWidth;
  }
}
