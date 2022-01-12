import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { DataService } from '../../services/data.service';
import { DatosPartido, DatosCorte } from '../../interfaces/data.interface';
import { DialogEliminarVideoComponent } from '../../components/dialog-eliminar-video/dialog-eliminar-video.component';
import { DialogEliminarCorteComponent } from '../../components/dialog-eliminar-corte/dialog-eliminar-corte.component';
import { InterdataService } from '../../services/interdata.service';

@Component({
  selector: 'app-datos-partido',
  templateUrl: './datos-partido.component.html',
  styleUrls: ['./datos-partido.component.css']
})
export class DatosPartidoComponent implements OnInit {

  datosPartido!: DatosPartido;
  listadoCortes: DatosCorte[] = [];

  displayedColumns: string[] = ['valoracion', 'situacion', 'tipo', 'posicion', 'arbitro', 'comentario'];
  cargando: boolean = true;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private dataService: DataService,
    private interdataService: InterdataService
  ) { }

  ngOnInit(): void {

    this.cargando = true;
    const idPartido = this.interdataService.getIdPartidoFromCache();
    if (idPartido) {

      this.dataService.obtenerDatosPartido(idPartido)
        .pipe(
          switchMap(({ partido }) => this.asignarPartidoYBuscarCortes(partido))
        ).subscribe(listadoCortesResp => {
          this.listadoCortes = listadoCortesResp;
          this.cargando = false;
        });

    } else {
      this.router.navigateByUrl('/dashboard');
    }

  }

  // ************************************************** //
  // ********      MÉTODOS AUXILIARES           ******* //
  // ************************************************** //
  // Asigna los datos del partido a la variable y lanza la petición para obtener los cortes.
  asignarPartidoYBuscarCortes(partido: any): Observable<any> {
    this.datosPartido = partido;
    return this.dataService.obtenerCortesDelPartido(this.datosPartido._id!);
  }

  urlVideoPartido(): string {
    return `https://www.youtube.com/watch?v=${this.datosPartido.url}`;
  }

  generarNuevoCorte() {
    this.interdataService.setIdCorteToCache(this.datosPartido._id!);
    this.router.navigateByUrl(`/dashboard/partidos/partido/nuevo-corte`);
  }

  // ************************************************** //
  // ********      PARTIDOS                     ******* //
  // ************************************************** //
  modificarPartido() {
    this.interdataService.setIdPartidoToCache(this.datosPartido._id!);
    this.router.navigateByUrl(`/dashboard/partidos/modificar-partido`);
  }

  eliminarPartido() {
    const dialogRef = this.dialog.open(DialogEliminarVideoComponent,
      { restoreFocus: false, data: { id: this.datosPartido._id, borrado: null } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.eliminarPartido(this.datosPartido._id!)
          .subscribe(() => {

            // Partido borrado
            this.router.navigateByUrl('/dashboard/videos');

            Swal.fire({
              title: 'Partido borrado',
              text: 'Se ha borrado el partido correctamente.',
              icon: 'success'
            });

          }, err => {
            console.log(err);
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al intentar eliminar el partido. Inténtelo de nuevo más tarde.',
              icon: 'error'
            })
          });

      }
    }, err => {
      console.log(err);
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al intentar eliminar el partido. Inténtelo de nuevo más tarde.',
        icon: 'error'
      })
    })
  }


  // ************************************************** //
  // ********      CORTES                       ******* //
  // ************************************************** //
  modificarCorte(idCorte: string) {
    this.interdataService.setIdPartidoToCache(this.datosPartido._id!);
    this.interdataService.setIdCorteToCache(idCorte);
    this.router.navigateByUrl('/dashboard/partidos/partido/modificar-corte');
  }

  eliminarCorte(idCorte: string) {
    const dialogRef = this.dialog.open(DialogEliminarCorteComponent,
      { restoreFocus: false, data: { id: idCorte, borrado: null } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.eliminarCorte(idCorte)
          .subscribe(() => {

            // Quitamos el corte de la lista
            let enc = false;
            let i = 0;
            do {
              if (this.listadoCortes[i]._id === idCorte) {
                this.listadoCortes.splice(i, 1);
                enc = true;
              } else {
                i++;
              }
            } while (!enc && i < this.listadoCortes.length);

            Swal.fire({
              title: 'Corte borrado',
              text: 'Se ha borrado el corte correctamente.',
              icon: 'success'
            });

          }, err => {
            console.log(err);
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al intentar eliminar el corte. Inténtelo de nuevo más tarde.',
              icon: 'error'
            })
          });

      }
    }, err => {
      console.log(err);
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al intentar corte el partido. Inténtelo de nuevo más tarde.',
        icon: 'error'
      })
    })
  }

  // ************************************************** //
  // ********      FUNCIONES DE TAMAÑO          ******* //
  // ************************************************** //
  getFxFlexVideo(corte: DatosCorte) {
    return (corte.valoracion ? 60 : 100);
  }

  getYoutubePlayerWidth() {
    return window.innerWidth > 500 ? 500 : window.innerWidth;
  }
}
