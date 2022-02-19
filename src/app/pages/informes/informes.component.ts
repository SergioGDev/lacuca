import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DatosInforme } from '../../interfaces/data.interface';
import { InformesService } from '../../services/informes.service';
import { InterdataService } from '../../services/interdata.service';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {

  cargandoInformes: boolean = true;
  cargandoIsAdmin: boolean = true;
  cargandoIsInformador: boolean = true;

  listadoInformes: DatosInforme[] = [];
  listadoMisInformes: DatosInforme[] = [];
  
  isAdmin: boolean = false;
  isInformador: boolean = false;

  msgMisInformesSinAsignar: string = "No tienes ningún informe asignado";
  
  constructor(
    private informesService: InformesService,
    private authService: AuthService,
    private interdataService: InterdataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.interdataService.limpiarCache();
    this.cargandoInformes = true;

    this.informesService.obtenerListadoInformesConDatos().pipe(
      switchMap( listadoInformesResp => this.asignarListadoInformesYObtenerUsuarioActual(listadoInformesResp))
    ).subscribe( ({user}) => {
      this.listadoInformes.forEach( informe => {
        // Guardamos el listado de mis informes asignados
        if (informe.arbitroPrincipal === user._id || 
          informe.arbitroAuxiliar === user._id ||
          informe.informador === user._id) {
            this.listadoMisInformes.push(informe);
          }
      })
  
      this.cargandoInformes = false;    
    })
    
    this.authService.herokuValidarIsAdmin().subscribe(resp => {
      this.isAdmin = resp;
      this.cargandoIsAdmin = false;
    })
    this.authService.herokuValidarIsInformador().subscribe(resp => {
      this.isInformador = resp;
      this.cargandoIsInformador = false;
    })

  }


  // Control de vista
  mostrarTablaCompleta(): boolean {
    return this.cargadosTodosLosDatos() && (this.isAdmin || this.isInformador);
  }

  asignarListadoInformesYObtenerUsuarioActual(listadoInformesResp: DatosInforme[]) {
    this.listadoInformes = listadoInformesResp;
    return this.authService.herokuRenew();
  }

  cargadosTodosLosDatos(): boolean {
    return !this.cargandoInformes && !this.cargandoIsAdmin && !this.cargandoIsInformador;
  }

  // Cambio de vista
  registrarInforme() {
    this.router.navigateByUrl('/dashboard/informes/nuevo-informe');
  }

  realizarInforme(idInforme: string) {
    this.interdataService.setIdInformeToCache(idInforme);
    this.router.navigateByUrl('/dashboard/informes/realizar-informe');
  }

  


}
