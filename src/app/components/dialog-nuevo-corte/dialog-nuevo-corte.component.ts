import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-nuevo-corte',
  templateUrl: './dialog-nuevo-corte.component.html',
  styles: [
  ]
})
export class DialogNuevoCorteComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  nuevoCorte(): void {
    this.data.guardado = true;
  }

  clickVolver(): void {
    this.data.guardado = false;
  }


}
