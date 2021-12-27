import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-modificar-partido',
  templateUrl: './dialog-modificar-partido.component.html',
  styleUrls: ['./dialog-modificar-partido.component.css']
})
export class DialogModificarPartidoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  modificarPartido(): void {
    this.data.modificado = true;
  }

  clickVolver(): void {
    this.data.modificado = false;
  }
}
