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
  styleUrls: [ './listado-usuarios.component.css' ]
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
  ) { }

  ngOnInit(): void {
    this.interdataService.limpiarCache();
    this.authService.herokuGetUserList().subscribe(
      data => {
        this.listadoUsuarios = data.users;
        this.cargandoUsuarios = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  registrarUsuario() {
    
  }

  registrarListadoUsuarios() {
    this.router.navigateByUrl('/dashboard/listado-usuarios/registrar-listado-usuarios')
  }

  registrarGrupo() {
    
  }
}
