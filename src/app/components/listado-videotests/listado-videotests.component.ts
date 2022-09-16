import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { DatosVideotest } from '../../interfaces/data.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VideotestService } from '../../services/videotest.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogEliminarComponent } from '../dialog-eliminar/dialog-eliminar.component';
import { DialogConfirmarComponent } from '../dialog-confirmar/dialog-confirmar.component';
import { InterdataService } from '../../services/interdata.service';

@Component({
  selector: 'app-listado-videotests',
  templateUrl: './listado-videotests.component.html',
  styleUrls: ['./listado-videotests.component.css']
})
export class ListadoVideotestsComponent implements OnInit {

  @Input() listadoVideotests: DatosVideotest[] = [];

  // Variables para la tabla y el paginador
  dataSource: any;
  displayedColums = ['nombre', 'descripcion', 'num_preguntas', 'acciones'];
  resultsLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private videotestsService: VideotestService,
    private interdataService: InterdataService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.asignarDataSource();
  }

  asignarDataSource() {
    this.dataSource = new MatTableDataSource<DatosVideotest>(this.listadoVideotests);
    this.dataSource.data = this.listadoVideotests;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.resultsLength = this.listadoVideotests.length;
  }

  ordenarTablaBusqueda(sort: any) {
    const data = this.listadoVideotests.slice();
    if (!sort.active || sort.direction === '') {
      this.listadoVideotests = data;
      return;
    }

    
    var aux;
    for (var i = 1; i < data.length; i++) {
      for (var j = 1; j < data.length; j++) {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {

          case 'nombre':
            if ((data[j].nombre && data[j-1].nombre) &&
              ((isAsc && data[j-1].nombre!.toLowerCase() > data[j].nombre!.toLowerCase()) || 
              (!isAsc && data[j-1].nombre!.toLowerCase() < data[j].nombre!.toLowerCase()))) {
              aux = data[j-1];
              data[j-1] = data[j];
              data[j] = aux;
            }

            break;

          case 'num_preguntas':

            if ((data[j].preguntas && data[j-1].preguntas) &&
              ((isAsc && data[j-1].preguntas!.length > data[j].preguntas!.length) || 
              (!isAsc && data[j-1].preguntas!.length < data[j].preguntas!.length))) {
              aux = data[j-1];
              data[j-1] = data[j];
              data[j] = aux;
            }

            break;

        }
      }
    }
      
    this.listadoVideotests = data;
    this.asignarDataSource();
  }

  // Acciones
  verDatosVideotest(idVideotest: string) {
    this.interdataService.setIdVideotestToCache(idVideotest);
    this.router.navigateByUrl('/dashboard/zona-tests/admin-videotest/ver-videotest');
  }

  modificarVideotest(idVideotest: string) {
    this.interdataService.setIdVideotestToCache(idVideotest);
    this.router.navigateByUrl('/dashboard/zona-tests/admin-videotest/editar-videotest');
  }

  eliminarVideotest(datosVideotest: DatosVideotest) {
    const dialogRef = this.dialog.open( DialogEliminarComponent, 
      {
        restoreFocus: false,
        data: { 
          eliminado: false, 
          mensajeDialog: `¿Estás seguro de que quieres eliminar el videotest "${datosVideotest.nombre}"? (Importante: esta acción no se puede deshacer)`
        }
      })

    dialogRef.afterClosed().subscribe(
      eliminado => {
        if (eliminado) {
          this.videotestsService.eliminarVideotest(datosVideotest._id!).subscribe(
            () => {
              const index = this.listadoVideotests.indexOf(datosVideotest);
              this.listadoVideotests.splice(index, 1);
              this.asignarDataSource();

              this.dialog.open( DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'El videotest se ha sido eliminado.'
                })
            },
            err => {
              console.log(err);
              this.dialog.open( DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'Ha ocurrido un error al eliminar el videotest. Inténtelo de nuevo más tarde.'
                })
            }
          )
        }
      }
    )
  }
}
