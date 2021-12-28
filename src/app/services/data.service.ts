import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { LacucaRespuesta, ItemPregunta, DatosPartido, OptionItem } from '../interfaces/data.interface';
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
  obtenerCortesDelPartido(idPartido: string): Observable<any> {
    return this.http.get(`${environment.herokuUrl}/corte?_partidoId=${idPartido}`);
  }

  /* ****************************************** */
  /* ***********     SELECTS       ************ */
  /* ****************************************** */
  obtenerVValoracion(): OptionItem[] {
    return [
      {value: 'correcta', texto: 'Correcta'}, 
      {value: 'inorrecta', texto: 'Incorrecta'}
    ]
  }

  obtenerVSituacion(): OptionItem[] {
    return [
      { value: 'falta', texto: 'Falta' },
      { value: 'violacion', texto: 'Violación' },
      { value: 'no-call', texto: 'No call' },
      { value: 'falta-no-pitada', texto: 'Falta no pitada' },
      { value: 'violacion-no-pitada', texto: 'Violación no pitada' },
      { value: 'mecanica', texto: 'Mecánica'}
    ];
  }

  obtenerVTipo(): OptionItem[] {
    return [ 
      { value: 'accion-continua', texto:'Acción Continua' }, 
      { value: 'accion-tiro', texto:'Acción tiro' }, 
      { value: 'agarra', texto:'Agarra' }, 
      { value: 'antideportiva', texto:'Antideportiva' }, 
      { value: 'ataque', texto:'Ataque' }, 
      { value: 'bloqueo', texto:'Bloqueo' }, 
      { value: 'campo-atras', texto:'Campo atrás' }, 
      { value: 'carga', texto:'Carga' }, 
      { value: 'descalificante', texto:'Descalificante' }, 
      { value: 'doble-regate', texto:'Doble regate' }, 
      { value: 'empujar', texto:'Empujar' }, 
      { value: 'falta-doble', texto:'Falta doble' }, 
      { value: 'fuera-banda', texto:'Fuera de banda' }, 
      { value: 'intereferencia', texto:'Interferencia' }, 
      { value: 'interposicion', texto:'Interposición' }, 
      { value: 'intuye', texto:'Intuye' }, 
      { value: 'manos', texto:'Manos' }, 
      { value: 'pasos', texto:'Pasos' }, 
      { value: 'pie', texto:'Pie' }, 
      { value: 'pos-defensa', texto:'Pos. defensa' }, 
      { value: 'rebote', texto:'Rebote' }, 
      { value: 'simula', texto:'Simula' }, 
      { value: 'tecnica', texto:'Técnica' }, 
      { value: 'temporal', texto:'Temporal' }, 
      { value: 'vertical', texto:'Vertical' }, 
      { value: 'otras', texto:'Otras' }
    ]

  }

  obtenerVPosicion(): OptionItem[] {
    return [
      { value: 'cabeza', texto: 'Cabeza'},
      { value: 'cola', texto: 'Cola'},
      { value: 'cabeza-cola', texto: 'Cabeza - Cola'},
      { value: 'cola-cabeza', texto: 'Cola - Cabeza'}
    ]
  }

  obtenerVArbitro(): OptionItem[] {
    return [
      { value: 'principal', texto: 'Principal' },
      { value: 'auxiliar', texto: 'Auxiliar' },
      { value: 'ambos', texto: 'Ambos' }
    ];
  }
}
