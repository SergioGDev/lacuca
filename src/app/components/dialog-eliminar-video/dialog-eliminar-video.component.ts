import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dialog-eliminar-video',
  templateUrl: './dialog-eliminar-video.component.html',
  styleUrls: ['./dialog-eliminar-video.component.css']
})
export class DialogEliminarVideoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public id: string,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
  }

  eliminarPartido(): void {
    this.dataService.eliminarPartido(this.id)
      .subscribe(resp => {
        console.log("Partido eliminado correctamente:", resp);
      }, err => {
        console.log("Error!!", err);
      })
  }
  
}
