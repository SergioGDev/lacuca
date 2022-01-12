import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-eliminar-corte',
  templateUrl: './dialog-eliminar-corte.component.html',
  styles: [
  ]
})
export class DialogEliminarCorteComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  eliminarCorte(): void {
    this.data.borrado = true;
  }

  clickVolver(): void {
    this.data.borrado = false;
  }

}
