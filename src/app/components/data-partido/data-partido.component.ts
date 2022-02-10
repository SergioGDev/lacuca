import { Component, Input, OnInit } from '@angular/core';
import { DatosPartido } from '../../interfaces/data.interface';

@Component({
  selector: 'app-data-partido',
  templateUrl: './data-partido.component.html',
  styleUrls: ['./data-partido.component.css']
})
export class DataPartidoComponent implements OnInit {

  @Input() datosPartido?: DatosPartido;

  constructor() { }

  ngOnInit(): void {
  }

}
