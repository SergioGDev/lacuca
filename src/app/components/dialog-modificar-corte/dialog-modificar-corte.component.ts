import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-modificar-corte',
  templateUrl: './dialog-modificar-corte.component.html',
  styles: [
  ]
})
export class DialogModificarCorteComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  modificarCorte(): void {
    this.data.modificado = true;
  }

  clickVolver(): void {
    this.data.modificado = false;
  }

}
