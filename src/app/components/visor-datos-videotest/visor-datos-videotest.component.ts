import { Component, Input, OnInit } from '@angular/core';
import { DatosVideotest, DatosCorte } from '../../interfaces/data.interface';

@Component({
  selector: 'app-visor-datos-videotest',
  templateUrl: './visor-datos-videotest.component.html',
  styleUrls: ['./visor-datos-videotest.component.css']
})
export class VisorDatosVideotestComponent implements OnInit {

  @Input() preguntasVideotest!: DatosVideotest;

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
