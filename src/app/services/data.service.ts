import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { LacucaRespuesta, ItemPregunta } from '../interfaces/data.interface';
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
        this.vPreguntas = lacucaRespuesta.preguntas;
      });
  }

  getVPreguntas(): ItemPregunta[] {
    return this.vPreguntas;
  }

  getTestAleatorio(numeroPreguntas: number) {
    const vPreguntasRandom = this.vPreguntas.sort( () => 0.5 - Math.random());
    return vPreguntasRandom.slice(0, numeroPreguntas);
  }
  
  /* ****************************************** */
  /* ***********     USUARIOS      ************ */
  /* ****************************************** */
  getListadoUsuarios(): Observable<User[]> {
    return this.db.collection('usuarios').valueChanges() as Observable<User[]>;
  }
}
