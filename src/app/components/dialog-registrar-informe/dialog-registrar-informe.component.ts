import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-registrar-informe',
  templateUrl: './dialog-registrar-informe.component.html',
  styles: [
    `.content-dialog {
      max-width: 650px;
    }`
  ]
})
export class DialogRegistrarInformeComponent implements OnInit {

  modificar!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.modificar = this.data.modificar;
  }

  registrarCortes() {
    this.data.registrarCortes = true;
  }

  noRegistrarCortes() {
    this.data.registrarCortes = false;
  }
}
