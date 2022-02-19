import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { DatosPartido, DatosCorte } from '../../interfaces/data.interface';
import { InterdataService } from '../../services/interdata.service';
import { DialogEliminarComponent } from '../../components/dialog-eliminar/dialog-eliminar.component';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { PartidosService } from '../../services/partidos.service';
import { CortesService } from '../../services/cortes.service';

@Component({
  selector: 'app-datos-partido',
  templateUrl: './datos-partido.component.html',
  styleUrls: ['./datos-partido.component.css']
})
export class DatosPartidoComponent implements OnInit  {

  datosPartido!: DatosPartido;
  listadoCortes: DatosCorte[] = [];

  displayedColumns: string[] = ['valoracion', 'situacion', 'tipo', 'posicion', 'arbitro', 'comentario'];
  cargando: boolean = true;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private partidosService: PartidosService,
    private cortesService: CortesService,
    private interdataService: InterdataService
  ) { }

  ngOnInit(): void {

    this.cargando = true;
    const idPartido = this.interdataService.getIdPartidoFromCache();
    if (idPartido) {

      this.partidosService.obtenerDatosPartido(idPartido)
        .pipe(
          switchMap(({ partido }) => this.asignarPartidoYBuscarCortes(partido))
        ).subscribe(listadoCortesResp => {
          this.listadoCortes = listadoCortesResp;
          this.cargando = false;
        }, error => {
          console.log(error);
          this.router.navigateByUrl('/dashboard/listado-partidos');
          this.dialog.open( DialogConfirmarComponent, 
            {
              restoreFocus: false,
              data: 'Ha ocurrido un error al cargar los datos del partido. Consulte con el administrador del lugar.'
            });
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
    return this.cortesService.obtenerCortesDelPartido(this.datosPartido._id!);
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
    const dialogRef = this.dialog.open(DialogEliminarComponent,
      { 
        restoreFocus: false, 
        data: { eliminado: null, mensajeDialog: '¿Desea eliminar los datos del partido?' } 
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.partidosService.eliminarPartido(this.datosPartido._id!)
          .subscribe(() => {

            // Partido borrado
            this.router.navigateByUrl('/dashboard/partidos');
            this.dialog.open( DialogConfirmarComponent, 
              {
                restoreFocus: false,
                data: 'El partido ha sido eliminado correctamente.'
              });

          }, err => {
            console.log(err);
            this.dialog.open( DialogConfirmarComponent, 
              {
                restoreFocus: false,
                data: 'Ha ocurrido un error al intentar eliminar el partido. Inténtelo de nuevo más tarde. Contacte con el administrador para más información.'
              });
          });

      }
    }, err => {
      console.log(err);
      this.dialog.open( DialogConfirmarComponent, 
        {
          restoreFocus: false,
          data: 'Ha ocurrido un error al intentar eliminar el partido. Inténtelo de nuevo más tarde. Contacte con el administrador para más información.'
        });
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
    const dialogRef = this.dialog.open( DialogEliminarComponent,
      { 
        restoreFocus: false, data: { borrado: null } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cortesService.eliminarCorte(idCorte)
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
            this.dialog.open( DialogConfirmarComponent, 
              {
                restoreFocus: false,
                data: 'Se ha borrado el corte correctamente.'
              });

          }, err => {
            console.log(err);
            this.dialog.open( DialogConfirmarComponent, 
              {
                restoreFocus: false,
                data: 'Ha ocurrido un error al intentar eliminar el corte. Inténtelo de nuevo más tarde. Contacte con el administrador para más información.'
              });
          });

      }
    }, err => {
      console.log(err);
      this.dialog.open( DialogConfirmarComponent, 
        {
          restoreFocus: false,
          data: 'Ha ocurrido un error al intentar eliminar el corte. Inténtelo de nuevo más tarde. Contacte con el administrador para más información.'
        });
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
