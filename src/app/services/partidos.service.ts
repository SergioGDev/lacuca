import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DatosPartido } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {

  constructor(
    private http: HttpClient
  ) { }

  guardarPartido(datosPartido: DatosPartido): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.post(`${environment.herokuUrl}/partido/`, datosPartido, {headers: {'token': token}});
  }

  formatearPathVideo(path: string) {
    const idVideo: string = path.split('watch?v=')[1].split('&')[0];
    return `https://www.youtube.com/watch?v=${idVideo}`;
  }

  obtenerListadoPartidos(listadoIds: string[] = []): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${environment.herokuUrl}/partido/`, {headers: {listadoIds, 'token': token}});
  }

  eliminarPartido(idPartido: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.delete(`${environment.herokuUrl}/partido/${idPartido.toString()}`, {headers: {'token': token}});
  }

  obtenerDatosPartido(idPartido: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${environment.herokuUrl}/partido/${idPartido}`, {headers: {'token': token}});
  }

  modificarDatosPartido(datosPartido: DatosPartido): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.put(`${environment.herokuUrl}/partido/${datosPartido._id}/`, datosPartido, {headers: {'token': token}});
  }
}
