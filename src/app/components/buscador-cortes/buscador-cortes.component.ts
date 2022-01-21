import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../services/data.service';
import { OperationsService } from '../../services/operations.service';
import { DatosCorte } from '../../interfaces/data.interface';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerCorteComponent } from '../dialog-ver-corte/dialog-ver-corte.component';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-buscador-cortes',
  templateUrl: './buscador-cortes.component.html',
  styleUrls: ['./buscador-cortes.component.css']
})
export class BuscadorCortesComponent implements OnInit {

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
  displayedColums = ['selected', 'valoracion', 'situacion', 'tipo', 'posicion', 'equipoLocal', 'equipoVisitante', 'acciones'];
  resultsLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private operationService: OperationsService,
    private dataService: DataService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
  ) {
    this.dataSource = new MatTableDataSource<DatosCorte>(this.listadoCortes);
  }

  ngOnInit(): void {
    this.mostrarListadoCompletoCortes();
    this.eventsSubscription = this.eventActualizar
      .subscribe( datosCorte => {
        const index = this.listadoCompletoCortes.indexOf(datosCorte);
        this.listadoCompletoCortes[index].checkedVideotest = false;
        this.renderCheckedList();
      });
  }

  mostrarListadoCompletoCortes() {
    this.cargandoCortes = true;
    this.dataService.obtenerListadoCompletoCortes()
      .subscribe(listadoCortesResp => {
        this.listadoCortes = listadoCortesResp;
        this.listadoCompletoCortes = listadoCortesResp;

        var datosPartidosObtenido: number = 0;

        this.listadoCortes.forEach(corte => {
          this.dataService.obtenerDatosPartido(corte.idPartido)
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
      this.listadoOrdenado = data;
      return;
    }

    console.log(sort);
    this.listadoOrdenado = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'valoracion':
          return this.compare(a.valoracion!, b.valoracion!, isAsc);
        case 'situacion':
          return this.compare(a.situacion!, b.situacion!, isAsc);
        case 'tipo':
          return this.compare(a.tipo!, b.tipo!, isAsc);
        case 'posicion':
          return this.compare(a.posicion!, b.posicion!, isAsc);
        case 'equipoLocal':
          return this.compare(a.datosPartido!.equipoLocal, b.datosPartido!.equipoLocal, isAsc);
        case 'equipoVisitante':
          return this.compare(a.datosPartido!.equipoVisitante, b.datosPartido!.equipoVisitante, isAsc);
        default:
          return 0;
      }
    });

    this.asignarDataSource();
  }

  compare(a: string, b: string, isAsc: boolean) {
    return (a && b) ? (a.toLowerCase() < b.toLowerCase() ? -1 : 1) * (isAsc ? 1 : -1) : 
      (a ? -1 : 1);
    // return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  submitAplicarFiltros() {
    this.listadoCortes = this.operationService.filtrarLista(this.listadoCompletoCortes, this.formFiltros.value);
    this.asignarDataSource();
    this.cargandoCortes = false;
  }

  renderCheckedList() {
    this.listadoCortesSeleccionados = [];

    this.listadoCompletoCortes.forEach(corte => {
      if (corte.checkedVideotest) {
        this.listadoCortesSeleccionados.push(corte);
      }
    });
  }

  emitirCorte(corte: DatosCorte) {
    this.asignarDataSource();
    this.propagar.emit(corte);
  }

  verCorte(datosCorte: DatosCorte) {
    this.dialog.open(DialogVerCorteComponent, {data: {url: datosCorte}});
  }
}
