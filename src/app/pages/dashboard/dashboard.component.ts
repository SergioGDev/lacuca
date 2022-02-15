import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InformesService } from '../../services/informes.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { switchMap } from 'rxjs/operators';
import { Usuario } from '../../interfaces/usuario.interface';
import { DatosInforme } from '../../interfaces/data.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  cargandoUsuario: boolean = true;
  cargandoMisInformes: boolean = true;

  currentUser?: Usuario;
  listadoInformesUsuario: DatosInforme[] = [];

  constructor(
    private authService: AuthService,
    private informesService: InformesService,
    private dialog: MatDialog
  ) { }
  

  ngOnInit(): void {
    this.authService.herokuRenew().pipe(
      switchMap( resp => this.asignarUsuarioYObtenerInformes(resp))
    ).subscribe( listadoInformesResp => {
      this.listadoInformesUsuario = listadoInformesResp;
      this.cargandoMisInformes = false;
    }, err => {
      console.log(err);
      this.dialog.open( DialogConfirmarComponent,
        {
          restoreFocus: false,
          data: 'Error al obtener los datos del usuario.'
        })
    })
  }

  asignarUsuarioYObtenerInformes(resp: any) {
    const { user, token } = resp;
    // Guardamos el token y el usuario
    localStorage.setItem('token', token);
    this.currentUser = user;

    this.cargandoUsuario = false;

    return this.informesService.obtenerInformesAsociadosUsuario(this.currentUser!._id!);
  }

  mostrarDatos() {
    return !this.cargandoMisInformes && !this.cargandoUsuario;
  }

}
