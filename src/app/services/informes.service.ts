import { Injectable } from '@angular/core';
import { DatosInforme, DatosPartido, DatosCorte } from '../interfaces/data.interface';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PartidosService } from './partidos.service';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { Usuario } from '../interfaces/usuario.interface';
import { CortesService } from './cortes.service';

@Injectable({
  providedIn: 'root'
})
export class InformesService {

  constructor(
    private http: HttpClient,
    private partidosService: PartidosService,
    private cortesService: CortesService,
    private authService: AuthService
  ) { }

  datosInforme?: DatosInforme;
  listadoInformes?: DatosInforme[];

  guardarInforme(informe: DatosInforme): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.post(`${environment.herokuUrl}/informe/`, informe, {headers: {'token': token}});
  }

  obtenerListadoInformes(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${environment.herokuUrl}/informe/`, {headers: {'token': token}});
  }

  obtenerListadoInformesConDatos(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.get<DatosInforme[]>(`${environment.herokuUrl}/informe/`, {headers: {'token': token}})
      .pipe(
        switchMap( listadoInformesResp => this.asignarListadoInformesYObtenerListadoPartidos(listadoInformesResp)),
        switchMap( listadoPartidosResp => this.asignarDatosPartidoAListadoInformesYObtenerListadoUsuarios(listadoPartidosResp)),
        switchMap( listadoUsuariosResp => this.asignarUsuariosAListadoInformes(listadoUsuariosResp))
      );
  }

  obtenerInforme(idInforme: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${environment.herokuUrl}/informe/${idInforme}`, {headers: {'token': token}});
  }

  obtenerInformeCompleto(idInforme: string) {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${environment.herokuUrl}/informe/${idInforme}`, {headers: {'token': token}})
      .pipe(
        switchMap( informeResp => this.asignarInformeYObtenerDatosPartidos(informeResp)),
        switchMap( ({partido}) => this.asignarDatosPartidoAInformeYObtenerListadoUsuarios(partido)),
        switchMap( listadoUsuariosResp => this.asignarUsuariosYObtenerCortes(listadoUsuariosResp)),
        switchMap( listadoCortesResp => this.asignarListadoCortes(listadoCortesResp) )
      )
  }

  modificarInforme(informe: DatosInforme): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.put(`${environment.herokuUrl}/informe/${informe._id}`, informe, {headers: {'token': token}});
  }

  eliminarInforme(idInforme: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.delete(`${environment.herokuUrl}/informe/${idInforme}`, {headers: {'token': token}});
  }

  // ***********   Métodos adiccionales   ************ //
  // Métodos adiccionales para obtener datos de un informe
  asignarInformeYObtenerDatosPartidos(informeResp: DatosInforme) {
    this.datosInforme = informeResp;
    return this.partidosService.obtenerDatosPartido(informeResp.idPartido!);
  }

  asignarDatosPartidoAInformeYObtenerListadoUsuarios(datosPartido: DatosPartido) {
    this.datosInforme!.datosPartido = datosPartido;
    return this.authService.herokuGetUserListProtected();
  }

  asignarUsuariosYObtenerCortes(listadoUsuarios: Usuario[]) {
    listadoUsuarios.forEach( usuario => {
      if (this.datosInforme?.arbitroPrincipal === usuario._id) {
        this.datosInforme!.datosArbitroPrincipal = usuario;
      } else if (this.datosInforme?.arbitroAuxiliar === usuario._id) {
        this.datosInforme!.datosArbitroAuxiliar = usuario;
      } else if (this.datosInforme?.informador === usuario._id) {
        this.datosInforme!.datosInformador = usuario;
      }
    })

    return this.cortesService.obtenerCortesDelPartido(this.datosInforme!.idPartido!);
  }

  asignarListadoCortes(listadoCortes: DatosCorte[]) {
    this.datosInforme!.listadoCortes = [];
    listadoCortes.forEach( corte => {
      this.datosInforme!.cortesIds!.forEach( corteId => {
        if (corte._id === corteId) {
          corte.datosPartido = this.datosInforme?.datosPartido;
          this.datosInforme?.listadoCortes?.push(corte);
        }
      })
    })

    return of(this.datosInforme);
    
  }

  // Métodos adiccionales para obtener listado de informes con todos los datos
  asignarListadoInformesYObtenerListadoPartidos(listadoInformesResp: DatosInforme[]) {
    this.listadoInformes = listadoInformesResp;
    return this.partidosService.obtenerListadoPartidos();
  }

  asignarDatosPartidoAListadoInformesYObtenerListadoUsuarios(listadoPartidos: DatosPartido[]) {
    this.listadoInformes?.forEach( informe => {
      listadoPartidos.forEach( partido => {
        if (informe.idPartido === partido._id) {
          informe.datosPartido = partido;
        }
      })
    })

    return this.authService.herokuGetUserListProtected();
  }

  asignarUsuariosAListadoInformes(listadoUsuarios: Usuario[]) {
    this.listadoInformes?.forEach( informe => {
      listadoUsuarios.forEach( usuario => {
        if (informe.arbitroPrincipal === usuario._id) {
          informe.datosArbitroPrincipal = usuario;
        } else if (informe.arbitroAuxiliar === usuario._id) {
          informe.datosArbitroAuxiliar = usuario;
        } else if (informe.informador === usuario._id) {
          informe.datosInformador = usuario;
        }
      })
    })

    return of(this.listadoInformes);
  }
}
