import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { LacucaRespuesta, ItemPregunta, DatosPartido } from '../interfaces/data.interface';
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
    datosPartido.url = this.formatearPathVideo(datosPartido.url);
    console.log("Datos del partido:", datosPartido);
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
    return this.http.delete(`${environment.herokuUrl}/partido/${idPartido}`);
  }
}
