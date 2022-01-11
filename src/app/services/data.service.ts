import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { LacucaRespuesta, ItemPregunta, DatosPartido, OptionItem, DatosCorte } from '../interfaces/data.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  urlPreguntas: string = `${environment.herokuUrl}/pregunta`;

  vPreguntas: ItemPregunta[] = [];

  constructor(
    private http: HttpClient,
    private db: AngularFirestore
  ) { }
  /* ****************************************** */
  /* ***********      PREGUNTAS     *********** */
  /* ****************************************** */
  getPreguntas(): Observable<LacucaRespuesta> {
    return this.http.get<LacucaRespuesta>(this.urlPreguntas);
  }

  almacenarPreguntasEnVPreguntas(): void {
    this.http.get<LacucaRespuesta>(this.urlPreguntas)
      .subscribe(lacucaRespuesta => {
        console.log(lacucaRespuesta);
        this.vPreguntas = lacucaRespuesta.preguntas;
        console.log(this.vPreguntas);
      });
  }

  getVPreguntas(): ItemPregunta[] {
    return this.vPreguntas;
  }

  getTestAleatorio(numeroPreguntas: number): Observable<LacucaRespuesta> {
    return this.http.get<LacucaRespuesta>(
      `${environment.herokuUrl}/pregunta/test?_length=${numeroPreguntas}`
    );
  }

  /* ****************************************** */
  /* ***********     USUARIOS      ************ */
  /* ****************************************** */
  getListadoUsuarios(): Observable<User[]> {
    return this.db.collection('usuarios').valueChanges() as Observable<User[]>;
  }

  /* ****************************************** */
  /* ***********     PARTIDOS      ************ */
  /* ****************************************** */
  guardarPartido(datosPartido: DatosPartido): Observable<any> {
    console.log("Datos partido:", datosPartido);
    return this.http.post(`${environment.herokuUrl}/partido/`, datosPartido);
  }

  formatearPathVideo(path: string) {
    const idVideo: string = path.split('watch?v=')[1].split('&')[0];
    return `https://www.youtube.com/watch?v=${idVideo}`;
  }

  obtenerListadoPartidos(): Observable<any> {
    return this.http.get(`${environment.herokuUrl}/partido/`);
  }

  eliminarPartido(idPartido: string): Observable<any> {
    return this.http.delete(`${environment.herokuUrl}/partido/${idPartido.toString()}`);
  }

  obtenerDatosPartido(idPartido: string): Observable<any> {
    return this.http.get(`${environment.herokuUrl}/partido/${idPartido}`);
  }

  modificarDatosPartido(datosPartido: DatosPartido): Observable<any> {
    return this.http.put(`${environment.herokuUrl}/partido/${datosPartido._id}/`, datosPartido);
  }

  /* ****************************************** */
  /* ***********     CORTES        ************ */
  /* ****************************************** */
  guardarCorte(datosCorte: DatosCorte): Observable<any> {
    console.log("GUARDAR CORTE SERVICE\n", datosCorte)
    console.log(`${environment.herokuUrl}/corte/`);
    return this.http.post(`${environment.herokuUrl}/corte/`, datosCorte);
  }

  eliminarCorte(idCorte: string): Observable<any> {
    return this.http.delete(`${environment.herokuUrl}/corte/${idCorte}`);
  }

  modificarDatosCorte(datosCorte: DatosCorte): Observable<any> {
    return this.http.put(`${environment.herokuUrl}/corte/${datosCorte._id}/`, datosCorte);
  }

  obtenerDatosCorte(idCorte: string) {
    return this.http.get(`${environment.herokuUrl}/corte/${idCorte}`);
  }

  obtenerCortesDelPartido(idPartido: string): Observable<any> {
    return this.http.get(`${environment.herokuUrl}/corte?_partidoId=${idPartido}`);
  }

  /* ****************************************** */
  /* ***********     SELECTS       ************ */
  /* ****************************************** */
  obtenerVValoracion(): string[] {
    return ['Correcta', 'Incorrecta']
  }

  obtenerVSituacion(): string[] {
    return [ 'Falta', 'Violación', 'No call', 'Falta no pitada', 'Violación no pitada', 'Mecánica' ];
  }

  obtenerVTipo(): string[] {
    return [ 'Acción Continua', 'Acción tiro','Agarra','Antideportiva','Ataque','Bloqueo','Campo atrás','Carga',
      'Descalificante','Doble regate','Empujar','Falta doble','Fuera de banda','Interferencia','Interposición',
      'Intuye','Manos','Pasos','Pie','Pos. defensa','Rebote','Simula','Técnica','Temporal','Vertical','Otras']
  }

  obtenerVPosicion(): string[] {
    return [ 'Cabeza', 'Cola', 'Cabeza - Cola', 'Cola - Cabeza']
  }

  obtenerVArbitro(): string[] {
    return [ 'Principal', 'Auxiliar', 'Ambos' ];
  }
}
