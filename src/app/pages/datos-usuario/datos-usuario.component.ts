import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/usuario.interface';
import { AuthService } from '../../services/auth.service';
import { InterdataService } from '../../services/interdata.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ROLE_ARBITRO, ROLE_INFORMADOR, ROLE_ADMIN } from '../../interfaces/auth.interface';
import { GruposService } from '../../services/grupos.service';

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html',
  styleUrls: ['./datos-usuario.component.css']
})
export class DatosUsuarioComponent implements OnInit {

  datosUsuario?: Usuario;
  cargandoDatosUsuarios: boolean = true;

  constructor(
    private authService: AuthService,
    private interdataService: InterdataService,
    private gruposService: GruposService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.cargandoDatosUsuarios = true;
    const lsUsuario = this.interdataService.getUserFromCache();

    if (lsUsuario) {
      this.datosUsuario = lsUsuario;
      
      this.cargandoDatosUsuarios = false;
    } else {
      this.router.navigateByUrl('/dashboard/listado-usuarios');
    }

  }

  editarDatosUsuario() {
    this.interdataService.setUserToCache(this.datosUsuario);
    this.router.navigateByUrl('/dashboard/listado-usuarios/editar-usuario')
  }

  // Obtiene un string con los roles del usuario
  rolesDelUsuario() {
    if (this.datosUsuario?.role?.includes(ROLE_ARBITRO) && 
      !this.datosUsuario?.role?.includes(ROLE_INFORMADOR) && 
      !this.datosUsuario?.role?.includes(ROLE_ADMIN)) {
        return 'Árbitro';
    } else if (!this.datosUsuario?.role?.includes(ROLE_ARBITRO) && 
    this.datosUsuario?.role?.includes(ROLE_INFORMADOR) && 
    !this.datosUsuario?.role?.includes(ROLE_ADMIN)) {
      return 'Informador';
    } else if (!this.datosUsuario?.role?.includes(ROLE_ARBITRO) && 
    !this.datosUsuario?.role?.includes(ROLE_INFORMADOR) && 
    this.datosUsuario?.role?.includes(ROLE_ADMIN)) {
      return 'Administrador';
    } else if (this.datosUsuario?.role?.includes(ROLE_ARBITRO) && 
    this.datosUsuario?.role?.includes(ROLE_INFORMADOR) && 
    !this.datosUsuario?.role?.includes(ROLE_ADMIN)) {
      return 'Árbitro e Informador';
    } else if (this.datosUsuario?.role?.includes(ROLE_ARBITRO) && 
    !this.datosUsuario?.role?.includes(ROLE_INFORMADOR) && 
    this.datosUsuario?.role?.includes(ROLE_ADMIN)) {
      return 'Árbitro y Administrador'
    } else if (!this.datosUsuario?.role?.includes(ROLE_ARBITRO) && 
    this.datosUsuario?.role?.includes(ROLE_INFORMADOR) && 
    this.datosUsuario?.role?.includes(ROLE_ADMIN)) {
      return 'Informador y Administrador';
    } else {
      return 'Árbitro, Informador y Administrador';
    }
  }

}
