import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../interfaces/usuario.interface';
import { MatTableDataSource } from '@angular/material/table';
import { InterdataService } from '../../services/interdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-usuarios',
  templateUrl: './data-usuarios.component.html',
  styleUrls: ['./data-usuarios.component.css']
})
export class DataUsuariosComponent implements OnInit, AfterViewInit {

  @Input() listadoUsuarios: Usuario[] = [];

  // Variables para la tabla y el paginador (Angular material)
  dataSource: any;
  displayedColums = ['nombre', 'apellidos', 'delegacion', 'email', 'acciones'];
  resultLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private interdataService: InterdataService,
    private router: Router
  ) {  }

  ngOnInit(): void {
    this.asignarDataSource();
  }

  ngAfterViewInit(): void {
    this.asignarDataSource();
  }

  asignarDataSource() {
    this.dataSource = new MatTableDataSource<Usuario>(this.listadoUsuarios);
    this.dataSource.data = this.listadoUsuarios;
    this.dataSource.paginator = this.paginator;
    this.resultLength = this.listadoUsuarios.length;
  }


  ordenarTablaBusqueda(sort: any) {
    const data = this.listadoUsuarios.slice();
    if (!sort.active || sort.direction === '') {
      this.listadoUsuarios = data;
      return;
    }

    var aux;
    for (var i = 0; i < data.length; i++) {
      for (var j = 1; j < data.length; j++) {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {

          case 'nombre':

            if ((isAsc && data[j - 1].nombre!.toLowerCase() > data[j].nombre!.toLowerCase()) ||
              (!isAsc && data[j - 1].nombre!.toLowerCase() < data[j].nombre!.toLowerCase())) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }

            break;

          case 'apellidos':

            if ((isAsc && data[j - 1].apellidos!.toLowerCase() > data[j].apellidos!.toLowerCase()) ||
              (!isAsc && data[j - 1].apellidos!.toLowerCase() < data[j].apellidos!.toLowerCase())) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }

            break;

          case 'nif':

            if ((isAsc && data[j - 1].nif!.toLowerCase() > data[j].nif!.toLowerCase()) ||
              (!isAsc && data[j - 1].nif!.toLowerCase() < data[j].nif!.toLowerCase())) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }

            break;

          case 'delegacion':

            if ((isAsc && data[j - 1].delegacion!.toLowerCase() > data[j].delegacion!.toLowerCase()) ||
              (!isAsc && data[j - 1].delegacion!.toLowerCase() < data[j].delegacion!.toLowerCase())) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }

            break;

          case 'email':

            if ((isAsc && data[j - 1].email!.toLowerCase() > data[j].email!.toLowerCase()) ||
              (!isAsc && data[j - 1].email!.toLowerCase() < data[j].email!.toLowerCase())) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }

            break;

        }
      }
    }
    this.listadoUsuarios = data;
    this.asignarDataSource();
  }

  compare(a: string, b: string, isAsc: boolean) {
    const result = (a && b) ? (a.toLowerCase() < b.toLowerCase() ? -1 : 1) * (isAsc ? 1 : -1) : (a ? -1 : 1)
    return result;
  }

  editarUsuario(user: Usuario) {
    this.interdataService.setUserToCache(user);
    this.router.navigateByUrl('/dashboard/listado-usuarios/editar-usuario');
  }

  verDatosUsuario(user: Usuario) {
    this.interdataService.setUserToCache(user);
    this.router.navigateByUrl('/dashboard/listado-usuarios/ver-datos')
  }
}
