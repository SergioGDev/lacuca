import { Injectable } from '@angular/core';
import { DatosInforme } from '../interfaces/data.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PartidosService } from './partidos.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InformesService {

  constructor(
    private http: HttpClient,
    private partidosService: PartidosService,
    private authService: AuthService
  ) { }

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

  modificarInforme(informe: DatosInforme): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.put(`${environment.herokuUrl}/informe/${informe._id}`, informe, {headers: {'token': token}});
  }

  eliminarInforme(idInforme: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.delete(`${environment.herokuUrl}/informe/${idInforme}`, {headers: {'token': token}});
  }

}
