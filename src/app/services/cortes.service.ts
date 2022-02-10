import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatosCorte } from '../interfaces/data.interface';
import { Observable } from 'rxjs';
import { PartidosService } from './partidos.service';

@Injectable({
  providedIn: 'root'
})
export class CortesService {

  constructor(
    private http: HttpClient,
    private partidosService: PartidosService
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

  obtenerDatosCorte(idCorte: string) {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${environment.herokuUrl}/corte/${idCorte}`, {headers: {'token': token}});
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

  async obtenerListadoCompletoCortesConDatosPartidos() {
    const token = localStorage.getItem('token') || '';
    var listadoCortes: DatosCorte[] = [];

    await this.http.get<DatosCorte[]>(`${environment.herokuUrl}/corte`, {headers: {'token': token}})
      .toPromise<DatosCorte[]>()
      .then(listadoCortesResp => listadoCortes = listadoCortesResp);

    listadoCortes.forEach( (corte) => {
      this.partidosService.obtenerDatosPartido(corte.idPartido)
        .toPromise<any>()
        .then ( ({partido}) => corte.datosPartido = partido );
    })

    return listadoCortes;
  }
}
