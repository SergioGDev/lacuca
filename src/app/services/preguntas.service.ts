import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ItemPregunta, LacucaRespuesta } from '../interfaces/data.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  urlPreguntas: string = `${environment.herokuUrl}/pregunta`;

  vPreguntas: ItemPregunta[] = [];

  constructor(
    private http: HttpClient
  ) { }
  
  /* ****************************************** */
  /* ***********      PREGUNTAS     *********** */
  /* ****************************************** */
  getPreguntas(): Observable<LacucaRespuesta> {
    const token = localStorage.getItem('token') || '';
    return this.http.get<LacucaRespuesta>(this.urlPreguntas, {headers: {'token': token}});
  }

  almacenarPreguntasEnVPreguntas(): void {
    const token = localStorage.getItem('token') || '';
    this.http.get<LacucaRespuesta>(this.urlPreguntas, {headers: {'token': token}})
      .subscribe(lacucaRespuesta => this.vPreguntas = lacucaRespuesta.preguntas);
  }

  getVPreguntas(): ItemPregunta[] {
    return this.vPreguntas;
  }

  getTestAleatorio(numeroPreguntas: number): Observable<LacucaRespuesta> {
    const token = localStorage.getItem('token') || '';
    return this.http.get<LacucaRespuesta>(`${environment.herokuUrl}/pregunta/test?_length=${numeroPreguntas}`, {headers: {'token': token}});
  }

}
