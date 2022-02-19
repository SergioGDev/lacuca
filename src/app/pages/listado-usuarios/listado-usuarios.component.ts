import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { MatPaginator } from '@angular/material/paginator';
import { InterdataService } from '../../services/interdata.service';
import { GruposService } from '../../services/grupos.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { DatosGrupo } from '../../interfaces/data.interface';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: [ './listado-usuarios.component.css' ]
})
export class ListadoUsuariosComponent implements OnInit {

  listadoUsuarios: Usuario[] = [];
  listadoGrupos: DatosGrupo[] = [];

  cargando: boolean = true;
  editMode = false;
  usuarioEdit: Usuario | undefined;

  // Variables para la tabla y el paginador (Angular material)
  dataSource: any;
  displayedColums = ['nombre', 'apellidos', 'nif', 'delegacion', 'esInformador', 'esAdministrador', 'email', 'acciones'];
  resultLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private authService: AuthService,
    private gruposService: GruposService,
    private interdataService: InterdataService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.interdataService.limpiarCache();
    this.authService.herokuGetUserList().pipe(
      switchMap( ({users}) => this.asignarListadoUsuariosYObtenerListadoGrupos(users))
    ).subscribe(
      listadoGruposResp => {
        this.listadoGrupos = listadoGruposResp;
        this.cargando = false;
      },
      err => {
        console.log(err);
        this.router.navigateByUrl('/dashboard');
        this.dialog.open( DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'Ha ocurrido un error al obtener los datos. Inténtelo de nuevo más tarde. Contacte con el administrador del sitio.'
          })
      }
    )
  }

  registrarUsuario() {
    this.router.navigateByUrl('/dashboard/listado-usuarios/registrar-usuario');
  }

  registrarListadoUsuarios() {
    this.router.navigateByUrl('/dashboard/listado-usuarios/registrar-listado-usuarios')
  }

  asignarListadoUsuariosYObtenerListadoGrupos(listadoUsuariosResp: Usuario[]): Observable<any> {
    this.listadoUsuarios = listadoUsuariosResp;
    return this.gruposService.obtenerListadoGruposConDatos();
  }

  registrarGrupo() {
    this.router.navigateByUrl('/dashboard/listado-usuarios/registrar-grupo');
  }
}
