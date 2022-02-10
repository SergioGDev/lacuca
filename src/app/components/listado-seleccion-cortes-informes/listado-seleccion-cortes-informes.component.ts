import { Component, Input, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DatosCorte } from '../../interfaces/data.interface';
import { DialogVerCorteComponent } from '../dialog-ver-corte/dialog-ver-corte.component';

@Component({
  selector: 'app-listado-seleccion-cortes-informes',
  templateUrl: './listado-seleccion-cortes-informes.component.html',
  styles: [
  ]
})
export class ListadoSeleccionCortesInformesComponent implements OnInit, AfterViewInit {

  @Input() listadoCortesPartido!: DatosCorte[];
  eventsSubscription!: Subscription;
  @Input() eventActualizar!: Observable<DatosCorte>;
  @Output('corteEmitido') propagar: EventEmitter<DatosCorte> = new EventEmitter<DatosCorte>();

  // Variables para la tabla y el paginador
  dataSource: any;
  displayedColums = ['selected', 'valoracion', 'situacion', 'tipo', 'posicion', 'acciones'];
  resultsLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<DatosCorte>(this.listadoCortesPartido);
  }

  ngOnInit(): void {
    this.asignarDataSource();   
    this.eventsSubscription = this.eventActualizar
      .subscribe( datosCorte => {
        const index = this.listadoCortesPartido.indexOf(datosCorte);
        this.listadoCortesPartido[index].checked = false;
      })
  }

  ngAfterViewInit(): void {
    this.asignarDataSource();    
  }

  asignarDataSource() {
    this.dataSource = new MatTableDataSource<DatosCorte>(this.listadoCortesPartido);
    this.dataSource.data = this.listadoCortesPartido;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.resultsLength = this.listadoCortesPartido.length;
  }

  ordenarTablaBusqueda(sort: any) {
    const data = this.listadoCortesPartido.slice();
    if (!sort.active || sort.direction === '') {
      this.listadoCortesPartido = data;
      return;
    }

    
    var aux;
    for (var i = 1; i < data.length; i++) {
      for (var j = 1; j < data.length; j++) {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {

          case 'situacion':
            if ((data[j].situacion && data[j-1].situacion) &&
              ((isAsc && data[j-1].situacion!.toLowerCase() > data[j].situacion!.toLowerCase()) || 
              (!isAsc && data[j-1].situacion!.toLowerCase() < data[j].situacion!.toLowerCase()))) {
              aux = data[j-1];
              data[j-1] = data[j];
              data[j] = aux;
            }

            break;

          case 'tipo':

            if ((data[j].tipo && data[j-1].tipo) &&
              ((isAsc && data[j-1].tipo!.toLowerCase() > data[j].tipo!.toLowerCase()) || 
              (!isAsc && data[j-1].tipo!.toLowerCase() < data[j].tipo!.toLowerCase()))) {
              aux = data[j-1];
              data[j-1] = data[j];
              data[j] = aux;
            }

            break;

          case 'posicion':

            if ((data[j].posicion && data[j-1].posicion) &&
              ((isAsc && data[j-1].posicion!.toLowerCase() > data[j].posicion!.toLowerCase()) || 
              (!isAsc && data[j-1].posicion!.toLowerCase() < data[j].posicion!.toLowerCase()))) {
              aux = data[j-1];
              data[j-1] = data[j];
              data[j] = aux;
            }

            break;

          case 'valoracion':

            if ((data[j].valoracion && data[j-1].valoracion) &&
              ((isAsc && data[j-1].valoracion!.toLowerCase() > data[j].valoracion!.toLowerCase()) || 
              (!isAsc && data[j-1].valoracion!.toLowerCase() < data[j].valoracion!.toLowerCase()))) {
              aux = data[j-1];
              data[j-1] = data[j];
              data[j] = aux;
            }

            break;

          case 'equipoLocal':

            if ((data[j].datosPartido && data[j-1].datosPartido) &&
              ((isAsc && data[j-1].datosPartido!.equipoLocal!.toLowerCase() > data[j].datosPartido!.equipoLocal!.toLowerCase()) || 
              (!isAsc && data[j-1].datosPartido!.equipoLocal!.toLowerCase() < data[j].datosPartido!.equipoLocal!.toLowerCase()))) {
              aux = data[j-1];
              data[j-1] = data[j];
              data[j] = aux;
            }

            break;

          case 'equipoVisitante':

            if ((data[j].datosPartido && data[j-1].datosPartido) &&
              ((isAsc && data[j-1].datosPartido!.equipoVisitante!.toLowerCase() > data[j].datosPartido!.equipoVisitante!.toLowerCase()) || 
              (!isAsc && data[j-1].datosPartido!.equipoVisitante!.toLowerCase() < data[j].datosPartido!.equipoVisitante!.toLowerCase()))) {
              aux = data[j-1];
              data[j-1] = data[j];
              data[j] = aux;
            }

            break;

        }
      }
    }
      
    this.listadoCortesPartido = data;
    this.asignarDataSource();
  }

  renderCheckedList() {
    this.asignarDataSource();
  }

  emitirCorte(corte: DatosCorte) {
    this.asignarDataSource();
    this.propagar.emit(corte);
  }

  verCorte(datosCorte: DatosCorte) {
    console.log(datosCorte)
    this.dialog.open(DialogVerCorteComponent, {data: {datosCorte: datosCorte}});
  }

}
