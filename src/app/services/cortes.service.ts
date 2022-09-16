import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { DatosCorte, DatosPartido } from '../interfaces/data.interface';
import { PartidosService } from './partidos.service';
import { OperationsService } from './operations.service';

@Injectable({
  providedIn: 'root'
})
export class CortesService {

  listadoCortes: DatosCorte[] = [];

  constructor(
    private http: HttpClient,
    private partidosService: PartidosService,
    private operationService: OperationsService
  ) { }

  guardarCorte(datosCorte: DatosCorte): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.post(`${environment.herokuUrl}/corte/`, datosCorte, {headers: {'token': token}});
  }

  eliminarCorte(idCorte: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.delete(`${environment.herokuUrl}/corte/${idCorte}`, {headers: {'token': token}});
  }

  modificarDatosCorte(datosCorte: DatosCorte): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.put(`${environment.herokuUrl}/corte/${datosCorte._id}/`, datosCorte, {headers: {'token': token}});
  }

  obtenerDatosCorte(idCorte: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.get<any>(`${environment.herokuUrl}/corte/${idCorte}`, {headers: {'token': token}});
  }

  obtenerDatosCompletosCorte(idCorte: string): Observable<any> {
    var corte: DatosCorte;
    return this.http.get<any>(`${environment.herokuUrl}/corte/${idCorte}`, 
      {headers: {'token': this.operationService.getToken()}})
      .pipe(
        switchMap( datosCorteResp => {
            corte = datosCorteResp;
            return this.partidosService.obtenerDatosPartido(corte.idPartido!);
          }
        ),
        switchMap( ({partido}) => {
          corte.datosPartido = partido;
          return of(corte);
        })
      )
  }

  obtenerCortesDelPartido(idPartido: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const skip = 0;
    const offset = 999;
    return this.http.get(`${environment.herokuUrl}/corte?_partidoId=${idPartido}&_skip=${skip}&_offset=${offset}`, {headers: {'token': token}});
  }

  obtenerListadoCompletoCortes(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${environment.herokuUrl}/corte`, {headers: {'token': token}});
  }

  obtenerListadoCompletoCortesConDatosPartidos() {
    const token = localStorage.getItem('token') || '';

    return this.http.get<DatosCorte[]>(`${environment.herokuUrl}/corte`, {headers: {'token': token}})
      .pipe(
        switchMap( listadoCortesResp => this.asignarCortesYObtenerListadoPartidos(listadoCortesResp)),
        switchMap( listadoPartidosResp => this.asignarDatosPartidosAListadoCortes(listadoPartidosResp))
      )
  }

  obtenerDatosListadoCortes(idCorteList: string[]): Observable<DatosCorte[]> {
    const idsString = idCorteList.join(',');
    return this.http.get<DatosCorte[]>(`${environment.herokuUrl}/corte/`, {headers: {'idlist': idsString}});
  }

  obtenerDatosCompletosListadoCortes(idCortesList: string[]): Observable<DatosCorte[]> {
    const idsString = idCortesList.join(',');
    return this.http.get<DatosCorte[]>(`${environment.herokuUrl}/corte/`, {headers: {'idlist': idsString}})
    .pipe(
      switchMap( listadoCortesResp => this.asignarCortesYObtenerListadoPartidos(listadoCortesResp)),
      switchMap( listadoPartidosResp => this.asignarDatosPartidosAListadoCortes(listadoPartidosResp))
    )
  }

  // Métodos auxiliares
  asignarCortesYObtenerListadoPartidos(listadoCortesResp: DatosCorte[]) {
    this.listadoCortes = listadoCortesResp;
    return this.partidosService.obtenerListadoPartidos();
  }

  asignarDatosPartidosAListadoCortes(listadoPartidosResp: DatosPartido[]) {
    listadoPartidosResp.forEach( partido => {
      this.listadoCortes.forEach( corte => {
        if (partido._id === corte.idPartido) {
          corte.datosPartido = partido;
        }
      })
    })

    return of(this.listadoCortes);
  }
 
}
