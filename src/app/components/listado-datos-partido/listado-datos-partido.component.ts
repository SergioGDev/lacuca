import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatosPartido } from '../../interfaces/data.interface';
import { Router } from '@angular/router';
import { InterdataService } from '../../services/interdata.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-listado-datos-partido',
  templateUrl: './listado-datos-partido.component.html',
  styleUrls: ['./listado-datos-partido.component.css']
})
export class ListadoDatosPartidoComponent implements OnInit, AfterViewInit {

  @Input() listadoPartidos!: DatosPartido[];
  @Input() listadoMostrado!: DatosPartido[];

  // Variables para la tabla y el paginador
  dataSource: any;
  displayedColumns: string[] = ['equipoLocal', 'equipoVisitante', 'fecha', 'acciones'];
  displayedColumsXS: string[] = ['partido'];
  filtro: string = '';
  resultsLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private interdataService: InterdataService
  ) { }

  ngOnInit(): void {
    this.listadoMostrado = this.listadoAMostrar();
    this.asignarDataSource();
  }

  ngAfterViewInit(): void {
    this.listadoMostrado = this.listadoAMostrar();
    this.asignarDataSource();
    this.ordenarTablaListadoPartidos({active: 'fecha', direction: 'desc'});
  }

  asignarDataSource() {    
    this.dataSource = new MatTableDataSource<DatosPartido>(this.listadoMostrado);
    this.dataSource.data = this.listadoMostrado;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.resultsLength = this.listadoPartidos.length;
  }

  applyFilter(event: Event) {
    this.filtro = (event.target as HTMLInputElement).value;
    this.listadoMostrado = this.listadoAMostrar();
    this.asignarDataSource();
  }

  // Obtiene el listado que se debe mostrar en función al filtro.
  listadoAMostrar(): DatosPartido[] {
    return this.filtro === '' ? this.listadoPartidos :
      this.listadoPartidos.filter(partido =>
        partido.equipoLocal.toLowerCase().includes(this.filtro.trim().toLowerCase()) ||
        partido.equipoVisitante.toLowerCase().includes(this.filtro.trim().toLowerCase()) ||
        this.formatDDMMYYYY(partido.fechaHora).includes(this.filtro.trim().toLowerCase()));
  }

  ordenarTablaListadoPartidos(sort: any) {
    const data = this.listadoMostrado.slice();
    if (!sort.active || sort.direction == '') {
      this.listadoMostrado = data;
      return;
    }
    
    var aux;
    for (var i = 1; i < data.length; i++) {
      for (var j = 1; j < data.length; j++) {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {

          case 'equipoLocal':
            if ((data[j].equipoLocal && data[j - 1].equipoLocal) &&
              ((isAsc && data[j - 1].equipoLocal!.toLowerCase() > data[j].equipoLocal!.toLowerCase()) ||
                (!isAsc && data[j - 1].equipoLocal!.toLowerCase() < data[j].equipoLocal!.toLowerCase()))) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }
            break;

          case 'equipoVisitante':
            if ((data[j].equipoVisitante && data[j - 1].equipoVisitante) &&
              ((isAsc && data[j - 1].equipoVisitante!.toLowerCase() > data[j].equipoVisitante!.toLowerCase()) ||
                (!isAsc && data[j - 1].equipoVisitante!.toLowerCase() < data[j].equipoVisitante!.toLowerCase()))) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }
            break;

          case 'fecha':
            if ((data[j].fechaHora && data[j - 1].fechaHora) &&
              ((isAsc && data[j - 1].fechaHora! > data[j].fechaHora!) ||
                (!isAsc && data[j - 1].fechaHora! < data[j].fechaHora!))) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }
            break;

        }
      }
    }

    this.listadoMostrado = data;
    this.asignarDataSource();

  }

  formatDDMMYYYY(fecha: Date) {
    const split = fecha.toString().split('T')[0].split('-');
    const dia = parseInt(split[2]) + 1;
    return ((dia < 10 ? ('0' + dia) : dia) + '/' + split[1] + '/' + split[0]);
  }

  // Accede a los datos del partido deseado.
  verDatosPartido(id: any) {
    this.interdataService.setIdPartidoToCache(id);
    this.router.navigateByUrl(`/dashboard/partidos/partido`);
  }
}
