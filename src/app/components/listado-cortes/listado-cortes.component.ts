import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { DatosCorte } from '../../interfaces/data.interface';
import { InterdataService } from '../../services/interdata.service';
import { DialogConfirmarComponent } from '../dialog-confirmar/dialog-confirmar.component';
import { DialogEliminarComponent } from '../dialog-eliminar/dialog-eliminar.component';
import { PartidosService } from '../../services/partidos.service';
import { CortesService } from '../../services/cortes.service';

@Component({
  selector: 'app-listado-cortes',
  templateUrl: './listado-cortes.component.html',
  styleUrls: ['./listado-cortes.component.css']
})
export class ListadoCortesComponent implements OnInit {

  @Input() listadoCortes!: DatosCorte[];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private partidosService: PartidosService,
    private cortesService: CortesService,
    private interdataService: InterdataService
  ) { }

  ngOnInit(): void {
    this.listadoCortes.forEach(datosCorte => {
      this.partidosService.obtenerDatosPartido(datosCorte.idPartido)
        .subscribe( ({partido}) => datosCorte.datosPartido = partido )
    })
  }

  modificarCorte(corte: DatosCorte) {
    this.interdataService.setIdPartidoToCache(corte.idPartido);
    this.interdataService.setIdCorteToCache(corte._id!);
    this.router.navigateByUrl('/dashboard/partidos/partido/modificar-corte');
  }

  eliminarCorte(corte: DatosCorte) {
    const dialogRef = this.dialog.open( DialogEliminarComponent,
      { 
        restoreFocus: false, 
        data: { eliminado: null, mensajeDialog: '¿Desea eliminar los datos del corte?' } 
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cortesService.eliminarCorte(corte._id!)
          .subscribe(() => {

            // Quitamos el corte de la lista
            let enc = false;
            let i = 0;
            do {
              if (this.listadoCortes[i]._id === corte._id) {
                this.listadoCortes.splice(i, 1);
                enc = true;
              } else {
                i++;
              }
            } while (!enc && i < this.listadoCortes.length);

            this.dialog.open( DialogConfirmarComponent, 
              {
                restoreFocus: false,
                data: 'Los datos del corte se han borrado correctamente.'
              });

          }, err => {
            console.log(err);
            this.dialog.open( DialogConfirmarComponent, 
              {
                restoreFocus: false,
                data: 'Ha ocurrido un error al intentar corte el partido. Inténtelo de nuevo más tarde. Contacte con el administrador para más información.'
              });
          });

      }
    }, err => {
      console.log(err);
      this.dialog.open( DialogConfirmarComponent, 
        {
          restoreFocus: false,
          data: 'Ha ocurrido un error al intentar corte el partido. Inténtelo de nuevo más tarde. Contacte con el administrador para más información.'
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
