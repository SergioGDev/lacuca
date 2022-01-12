import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styles: [
  ]
})
export class ListadoUsuariosComponent implements OnInit {

  cargandoUsuarios: boolean = true;
  listadoUsuarios: Usuario[] = [];
  editMode = false;
  usuarioEdit: Usuario | undefined;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.herokuGetUserList().subscribe(
      data => {
        this.listadoUsuarios = data.users;
        console.log(data.users);
        this.cargandoUsuarios = false;
      },
      error => {
        console.log(error);
      }
    );

  }

  convertToDate(date: any) {
    return date.toDate();
  }

  esInformador(user: Usuario): string{
    if(user.role?.includes('ROLE_INFORMADOR')){
      return 'Sí';
    }
    return 'No';
  }

  esAdmin(user: Usuario): string{
    if(user.role?.includes('ROLE_ADMIN')){
      return 'Sí';
    }
    return 'No';
  }

  editar(user: Usuario){
    this.editMode = true;
    this.usuarioEdit = user;
  }

  onUsuarioGuardado(usuario: Usuario){
    console.log(usuario);
    this.editMode = false;
    this.authService.herokuGetUserList().subscribe(
      data => {
        this.listadoUsuarios = data.users;
        console.log(data.users);
        this.cargandoUsuarios = false;
      }
    );
  }

}
