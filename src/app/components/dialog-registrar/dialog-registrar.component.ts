import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-registrar',
  templateUrl: './dialog-registrar.component.html',
  styles: [
  ]
})
export class DialogRegistrarComponent implements OnInit {

  mensajeDialog: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
      this.mensajeDialog = this.data.mensajeDialog;
  }

  registrado(): void {
    this.data.registrado = true;
  }

  clickVolver(): void {
    this.data.registrado = false;
  }
}
