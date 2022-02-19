import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { zip } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';

@Component({
  selector: 'app-registrar-usuarios-csv',
  templateUrl: './registrar-usuarios-csv.component.html'
})
export class RegistrarUsuariosCsvComponent implements OnInit {

  textoBotonAdjuntar: string = 'Adjuntar fichero';
  
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  
  loadCsv(event: any){
    const filas: any[] = event;
    const usuarios: Usuario[] = [];
    filas.forEach(fila => {
      const usuario = this.parseUser(fila);
      if(usuario){
        usuarios.push(usuario);
      }
    });
    const arrObs = zip(...usuarios.map(u => this.authService.herokuNewUser(u)));
    arrObs.subscribe(
      () => {
        this.router.navigateByUrl('/dashboard/listado-usuarios')
        this.dialog.open(DialogConfirmarComponent,
         {
           restoreFocus: false,
           data: 'Se han creado todos los usuarios correctamente.'
         })
      },
      error => {
        console.log(error);
        this.dialog.open(DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'Se ha producido un error al crear los usuarios. Contacte con el administrador del sitio.'
          })
      }
    );
  }

  parseUser(csv: any) : Usuario | null{
    const { nombre, apellidos, email, nif, delegacion, admin, arbitro, informador } = csv;
    if(!nombre || !apellidos || !email || !nif || !delegacion){
      return null;
    }
    const role = [];
    if(admin && admin.toLowerCase() === 's'){
      role.push('ROLE_ADMIN');
    }
    if(arbitro && arbitro.toLowerCase() === 's'){
      role.push('ROLE_ARBITRO');
    }
    if(informador && informador.toLowerCase() === 's'){
      role.push('ROLE_INFORMADOR');
    }
    const password = nif.substr(0,8);
    return {
      nombre,
      apellidos,
      email,
      nif,
      delegacion,
      role,
      password
    };
  }

}
