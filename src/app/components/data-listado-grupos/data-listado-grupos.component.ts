import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { DatosGrupo } from '../../interfaces/data.interface';
import { MatTableDataSource } from '@angular/material/table';
import { InterdataService } from '../../services/interdata.service';
import { GruposService } from '../../services/grupos.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-data-listado-grupos',
  templateUrl: './data-listado-grupos.component.html',
  styles: [
  ]
})
export class DataListadoGruposComponent implements OnInit {

  @Input() listadoGrupos: DatosGrupo[] = [];

  // Variables para la tabla y el paginador (Angular material)
  dataSource: any;
  displayedColums = ['descripcion', 'responsables', 'acciones'];
  resultLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private interdataService: InterdataService,
    private gruposService: GruposService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.asignarDataSource();
  }

  asignarDataSource() {
    this.dataSource = new MatTableDataSource<DatosGrupo>(this.listadoGrupos);
    this.dataSource.data = this.listadoGrupos;
    this.dataSource.paginator = this.paginator;
    this.resultLength = this.listadoGrupos.length;
  }

  ordenarTablaBusqueda(sort: any) {
    const data = this.listadoGrupos.slice();
    if (!sort.active || sort.direction === '') {
      this.listadoGrupos = data;
      return;
    }

    var aux;
    for (var i = 0; i < data.length; i++) {
      for (var j = 1; j < data.length; j++) {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {

          case 'descripcion':

            if ((isAsc && data[j - 1].descripcion!.toLowerCase() > data[j].descripcion!.toLowerCase()) ||
              (!isAsc && data[j - 1].descripcion!.toLowerCase() < data[j].descripcion!.toLowerCase())) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }

            break;
        }
      }
    }
    this.listadoGrupos = data;
    this.asignarDataSource();
  }

  verDatosGrupo(idGrupo: string) {
    this.interdataService.setIdGrupoToCache(idGrupo);
    this.router.navigateByUrl('/dashboard/listado-usuarios/datos-grupo')
  }
}
