import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DomSanitizer } from '@angular/platform-browser';
import { DatosPartido } from '../../interfaces/data.interface';
import { DialogEliminarVideoComponent } from '../dialog-eliminar-video/dialog-eliminar-video.component';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent implements OnInit {

  @Input() datosVideo!: DatosPartido;
  @Output('videoBorrado') videoBorrado: EventEmitter<string> = new EventEmitter();
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  getPathEmbed(idPartido: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${idPartido}`); 
  }

  openDialogEliminarVideo() {
    const dialogRef = this.dialog.open(DialogEliminarVideoComponent, 
      {restoreFocus: false, data: {id: this.datosVideo._id, borrado: null}}
    );

    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        this.videoBorrado.emit(this.datosVideo._id);
      }
    });
  }
}
