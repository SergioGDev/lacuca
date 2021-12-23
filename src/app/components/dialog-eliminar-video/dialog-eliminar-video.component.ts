import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dialog-eliminar-video',
  templateUrl: './dialog-eliminar-video.component.html',
  styleUrls: ['./dialog-eliminar-video.component.css']
})
export class DialogEliminarVideoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  eliminarPartido(): void {
    this.data.borrado = true;
  }

  clickVolver(): void {
    this.data.borrado = false;
  }
}
