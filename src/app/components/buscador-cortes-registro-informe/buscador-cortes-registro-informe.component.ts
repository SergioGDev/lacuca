import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../services/data.service';
import { OperationsService } from '../../services/operations.service';
import { DatosCorte } from '../../interfaces/data.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerCorteComponent } from '../dialog-ver-corte/dialog-ver-corte.component';
import { CortesService } from '../../services/cortes.service';
import { PartidosService } from '../../services/partidos.service';

@Component({
  selector: 'app-buscador-cortes-registro-informe',
  templateUrl: './buscador-cortes-registro-informe.component.html',
  styles: [
  ]
})
export class BuscadorCortesRegistroInformeComponent implements OnInit {

  // Listados de cortes
  listadoCortes: DatosCorte[] = [];
  listadoOrdenado: DatosCorte[] = [];
  listadoCompletoCortes: DatosCorte[] = [];

  eventsSubscription!: Subscription;
  @Input() eventActualizar!: Observable<DatosCorte>;
  @Input('listadoCortesSeleccionados') listadoCortesSeleccionados: DatosCorte[] = [];
  @Output('corteEmitido') propagar: EventEmitter<DatosCorte> = new EventEmitter<DatosCorte>();
  
  // Flag cargando
  cargandoCortes: boolean = false;

  // Listado de valores para los selects
  vValoracion: string[] = this.dataService.obtenerVValoracion();
  vSituacion: string[] = this.dataService.obtenerVSituacion();
  vTipo: string[] = this.dataService.obtenerVTipo();
  vPosicion: string[] = this.dataService.obtenerVPosicion();

  // Formulario para el filtrado de cortes
  checkValoracion: boolean = true;

  formFiltros: FormGroup = this.fb.group({
    checkValoracion: [, []],
    valoracion: [, []],
    situacion: [, []],
    tipo: [, []],
    posicion: [, []],
    equipo: [, []]
  });

  textoCheckTieneValoracion: string = this.checkValoracion ?
    "Cortes con valoración" : "Cortes sin valoración";

  // Variables para la tabla y el paginador
  dataSource: any;
  displayedColums = ['selected', 'inicio', 'duracion', 'valoracion', 'situacion', 
    'tipo', 'posicion', 'equipoLocal', 'equipoVisitante', 'acciones'];
  resultsLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private operationService: OperationsService,
    private cortesService: CortesService,
    private partidosService: PartidosService,
    private dataService: DataService,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this.dataSource = new MatTableDataSource<DatosCorte>(this.listadoCortes);
  }

  ngOnInit(): void {
    this.mostrarListadoCompletoCortes();
    this.eventsSubscription = this.eventActualizar
      .subscribe( datosCorte => {
        const index = this.listadoCompletoCortes.indexOf(datosCorte);
        this.listadoCompletoCortes[index].checked = false;
        this.renderCheckedList();
      });
  }

  mostrarListadoCompletoCortes() {
    this.cargandoCortes = true;
    this.cortesService.obtenerListadoCompletoCortes()
      .subscribe(listadoCortesResp => {
        this.listadoCortes = listadoCortesResp;
        this.listadoCompletoCortes = listadoCortesResp;

        var datosPartidosObtenido: number = 0;
        
        // const idPartidoList = [... new Set(this.listadoCompletoCortes.map((corte) => corte.idPartido))]
        this.listadoCortes.forEach(corte => {
          this.partidosService.obtenerDatosPartido(corte.idPartido)
            .subscribe(({ partido }) => {
              corte.datosPartido = partido;

              datosPartidosObtenido++;
              // Cuando se han obtenido los datos de todos los partidos, se realiza un filtrado de la lista
              if (datosPartidosObtenido === this.listadoCortes.length) {
                this.asignarDataSource();
                this.cargandoCortes = false;
              } else {
                this.resultsLength = this.listadoCortes.length;
              }
            });
        })
      })
  }

  asignarDataSource() {
    this.dataSource = new MatTableDataSource<DatosCorte>(this.listadoCortes);
    this.dataSource.data = this.listadoCortes;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.resultsLength = this.listadoCortes.length;
  }

  ordenarTablaBusqueda(sort: any) {
    const data = this.listadoCortes.slice();
    if (!sort.active || sort.direction === '') {
      this.listadoCortes = data;
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
      
    this.listadoCortes = data;
    this.asignarDataSource();
  }

  compare(a: string, b: string, isAsc: boolean) {
    return (a && b) ? (a.toLowerCase() < b.toLowerCase() ? -1 : 1) * (isAsc ? 1 : -1) : (a ? -1 : 1);
  }

  submitAplicarFiltros() {
    this.listadoCortes = this.operationService.filtrarLista(this.listadoCompletoCortes, this.formFiltros.value);
    this.asignarDataSource();
    this.cargandoCortes = false;
  }

  renderCheckedList() {
    this.listadoCortesSeleccionados = [];

    this.listadoCompletoCortes.forEach(corte => {
      if (corte.checked) {
        this.listadoCortesSeleccionados.push(corte);
      }
    });
  }

  emitirCorte(corte: DatosCorte) {
    this.asignarDataSource();
    this.propagar.emit(corte);
  }

  verCorte(datosCorte: DatosCorte) {
    this.dialog.open(DialogVerCorteComponent, {data: {datosCorte: datosCorte}});
  }
}
