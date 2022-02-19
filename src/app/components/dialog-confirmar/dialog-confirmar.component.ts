import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmar',
  templateUrl: './dialog-confirmar.component.html',
  styles: [
  ]
})
export class DialogConfirmarComponent implements OnInit {

  mensajeDialog?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit(): void {
    this.mensajeDialog = this.data;
  }

}
