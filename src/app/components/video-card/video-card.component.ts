import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DatosPartido } from '../../interfaces/data.interface';
import { DialogEliminarVideoComponent } from '../dialog-eliminar-video/dialog-eliminar-video.component';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent implements OnInit {

  @Input() datosVideo!: DatosPartido;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  getPathEmbed(path: string) {
    path = (path.startsWith('https://www.youtube.com/watch?v=')) ?
      path.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/') :
      '';
    return path; 
  }

  openDialogEliminarVideo() {
    this.dialog.open(DialogEliminarVideoComponent, 
      {restoreFocus: false, data: {id: this.datosVideo._id}}
    );
  }
}
