import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-modificar',
  templateUrl: './dialog-modificar.component.html'
})
export class DialogModificarComponent implements OnInit {

  mensajeDialog: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.mensajeDialog = this.data.mensajeDialog;
  }

  modificado(): void {
    this.data.modificado = true;
  }

  clickVolver(): void {
    this.data.modificado = false;
  }

}
