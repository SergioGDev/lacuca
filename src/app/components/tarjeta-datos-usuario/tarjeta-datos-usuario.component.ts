import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/usuario.interface';
import { ROLE_ARBITRO, ROLE_INFORMADOR, ROLE_ADMIN } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-tarjeta-datos-usuario',
  templateUrl: './tarjeta-datos-usuario.component.html',
  styleUrls: ['./tarjeta-datos-usuario.component.css']
})
export class TarjetaDatosUsuarioComponent implements OnInit {

  @Input() datosUsuario!: Usuario;

  constructor() { }

  ngOnInit(): void {
  }

  rolesDelUsuario() {
    if (this.datosUsuario.role?.includes(ROLE_ARBITRO) && 
      !this.datosUsuario.role?.includes(ROLE_INFORMADOR) && 
      !this.datosUsuario.role?.includes(ROLE_ADMIN)) {
        return 'Árbitro';
    } else if (!this.datosUsuario.role?.includes(ROLE_ARBITRO) && 
    this.datosUsuario.role?.includes(ROLE_INFORMADOR) && 
    !this.datosUsuario.role?.includes(ROLE_ADMIN)) {
      return 'Informador';
    } else if (!this.datosUsuario.role?.includes(ROLE_ARBITRO) && 
    !this.datosUsuario.role?.includes(ROLE_INFORMADOR) && 
    this.datosUsuario.role?.includes(ROLE_ADMIN)) {
      return 'Administrador';
    } else if (this.datosUsuario.role?.includes(ROLE_ARBITRO) && 
    this.datosUsuario.role?.includes(ROLE_INFORMADOR) && 
    !this.datosUsuario.role?.includes(ROLE_ADMIN)) {
      return 'Árbitro e Informador';
    } else if (this.datosUsuario.role?.includes(ROLE_ARBITRO) && 
    !this.datosUsuario.role?.includes(ROLE_INFORMADOR) && 
    this.datosUsuario.role?.includes(ROLE_ADMIN)) {
      return 'Árbitro y Administrador'
    } else if (!this.datosUsuario.role?.includes(ROLE_ARBITRO) && 
    this.datosUsuario.role?.includes(ROLE_INFORMADOR) && 
    this.datosUsuario.role?.includes(ROLE_ADMIN)) {
      return 'Informador y Administrador';
    } else {
      return 'Árbitro, Informador y Administrador';
    }
  }

}
