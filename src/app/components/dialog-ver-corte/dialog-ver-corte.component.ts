import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatosCorte } from '../../interfaces/data.interface';

@Component({
  selector: 'app-dialog-ver-corte',
  templateUrl: './dialog-ver-corte.component.html',
  styles: [
  ]
})
export class DialogVerCorteComponent implements OnInit {

  corte!: DatosCorte;

  constructor(
    public dialogRef: MatDialogRef<DialogVerCorteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.corte = this.data.datosCorte;
  }

}
