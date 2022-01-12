import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { DatosCorte } from '../../interfaces/data.interface';
import { InterdataService } from '../../services/interdata.service';
import { DataService } from '../../services/data.service';
import { DialogEliminarCorteComponent } from '../dialog-eliminar-corte/dialog-eliminar-corte.component';

import Swal from 'sweetalert2';

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
    private dataService: DataService,
    private interdataService: InterdataService
  ) { }

  ngOnInit(): void {
    console.log("LISTADO CORTES COMPONENT:", this.listadoCortes);
    this.listadoCortes.forEach(datosCorte => {
      this.dataService.obtenerDatosPartido(datosCorte.idPartido)
        .subscribe( ({partido}) => datosCorte.datosPartido = partido )
    })
  }

  modificarCorte(corte: DatosCorte) {
    this.interdataService.setIdPartidoToCache(corte.idPartido);
    this.interdataService.setIdCorteToCache(corte._id!);
    this.router.navigateByUrl('/dashboard/partidos/partido/modificar-corte');
  }

  eliminarCorte(corte: DatosCorte) {
    const dialogRef = this.dialog.open(DialogEliminarCorteComponent,
      { restoreFocus: false, data: { id: corte._id, borrado: null } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.eliminarCorte(corte._id!)
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
