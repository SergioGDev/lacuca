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

  guardarInforme(informe: DatosInforme): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.post(`${environment.herokuUrl}/informe/`, informe, {headers: {'token': token}});
  }

  obtenerListadoInformes(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${environment.herokuUrl}/informe/`, {headers: {'token': token}});
  }

  async obtenerListadoInformesConDatos() {
    const token = localStorage.getItem('token') || '';
    var listadoInformes: DatosInforme[] = [];
    await this.http.get<DatosInforme[]>(`${environment.herokuUrl}/informe/`, {headers: {'token': token}})
      .toPromise<DatosInforme[]>()
      .then(listadoInformesResp => listadoInformes = listadoInformesResp);
    
    listadoInformes.forEach( (informe) => {
      // Datos del partido
      this.partidosService.obtenerDatosPartido(informe.idPartido!)
      .toPromise<any>()
      .then( ({ partido }) => informe.datosPartido = partido);
      
      // Datos del árbitro principal
      this.authService.herokuGetUserProtected(informe.arbitroPrincipal!)
      .toPromise<any>()
      .then( (usuario) => informe.datosArbitroPrincipal = usuario);
      
      // Datos del árbitro auxiliar
      this.authService.herokuGetUserProtected(informe.arbitroAuxiliar!)
      .toPromise<any>()
      .then( (usuario) => informe.datosArbitroAuxiliar = usuario);
      
      // Datos del informador
      this.authService.herokuGetUserProtected(informe.informador!)
      .toPromise<any>()
      .then( (usuario) => informe.datosInformador = usuario);
    })

    return listadoInformes;
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
        switchMap( ({partido}) => this.asignarDatosPartidoYObtenerListadoUsuarios(partido)),
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

  // Métodos adiccionales
  asignarInformeYObtenerDatosPartidos(informeResp: DatosInforme) {
    this.datosInforme = informeResp;
    return this.partidosService.obtenerDatosPartido(informeResp.idPartido!);
  }

  asignarDatosPartidoYObtenerListadoUsuarios(datosPartido: DatosPartido) {
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
}
