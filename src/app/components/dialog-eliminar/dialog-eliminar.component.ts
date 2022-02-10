import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-eliminar',
  templateUrl: './dialog-eliminar.component.html',
  styles: [
  ]
})
export class DialogEliminarComponent implements OnInit {

  mensajeDialog: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.mensajeDialog = this.data.mensajeDialog;
  }

  eliminado() {
    this.data.eliminado = true;
  }

  clickVolver() {
    this.data.eliminado = false;
  }

}
