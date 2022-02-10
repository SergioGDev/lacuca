import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InterdataService } from '../../services/interdata.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styles: [
    `.content-botones {
        background-color: white;
        border-radius: 3px;
        box-shadow: 2px 2px 5px var(--color-texto-negro-transparente);
        margin: 15px;
        padding: 10px;
    }`
  ]
})
export class ListadoUsuariosComponent implements OnInit {

  cargandoUsuarios: boolean = true;
  listadoUsuarios: Usuario[] = [];
  editMode = false;
  usuarioEdit: Usuario | undefined;

  // Variables para la tabla y el paginador (Angular material)
  dataSource: any;
  displayedColums = ['nombre', 'apellidos', 'nif', 'delegacion', 'esInformador', 'esAdministrador', 'email', 'acciones'];
  resultLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private authService: AuthService,
    private interdataService: InterdataService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Usuario>(this.listadoUsuarios);
  }

  ngOnInit(): void {
    this.authService.herokuGetUserList().subscribe(
      data => {
        this.listadoUsuarios = data.users;
        this.asignarDataSource();
        this.cargandoUsuarios = false;
      },
      error => {
        console.log(error);
      }
    );
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

  registrarUsuario() {
    
  }

  registrarListadoUsuarios() {
    this.router.navigateByUrl('/dashboard/listado-usuarios/registrar-listado-usuarios')
  }
}
