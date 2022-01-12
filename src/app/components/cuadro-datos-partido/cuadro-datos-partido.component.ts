import { Component, Input, OnInit } from '@angular/core';
import { DatosPartido } from '../../interfaces/data.interface';

@Component({
  selector: 'app-cuadro-datos-partido',
  templateUrl: './cuadro-datos-partido.component.html',
  styleUrls: ['./cuadro-datos-partido.component.css']
})
export class CuadroDatosPartidoComponent implements OnInit {

  @Input() datosPartido!: DatosPartido;

  constructor() { }

  ngOnInit(): void {
    console.log("CUADRO DATOS PARTIDO:", this.datosPartido);
  }

}
