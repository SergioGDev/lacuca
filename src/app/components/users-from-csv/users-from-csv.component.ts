import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { zip } from "rxjs";

@Component({
  selector: 'app-users-from-csv',
  templateUrl: './users-from-csv.component.html',
  styleUrls: ['./users-from-csv.component.css']
})
export class UsersFromCsvComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
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
      data => {
        Swal.fire({
          title: 'Usuarios creados',
          text: 'Se han creado los usuarios correctamente',
          icon: 'success'
        });
      },
      error => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: 'Se ha producido un error al crear los usuarios',
          icon: 'error'
        });
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
