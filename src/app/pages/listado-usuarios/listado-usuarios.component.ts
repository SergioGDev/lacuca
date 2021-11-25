import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { rolUsuario } from '../../interfaces/constantes.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styles: [
  ]
})
export class ListadoUsuariosComponent implements OnInit {

  cargandoUsuarios: boolean = true;
  listadoUsuarios: User[] = [];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.getCurrentUserRol() === rolUsuario) {

      // Solamente pueden acceder al listado de usuarios los administradores o diseñadores
      this.router.navigateByUrl('/dashboard/inicio');
      return;

    } else {

      this.dataService.getListadoUsuarios()
        .subscribe(resp => {
          this.listadoUsuarios = resp;
          this.cargandoUsuarios = false;
        });

    }

  }

  convertToDate(date: any) {
    return date.toDate();
  }

}
