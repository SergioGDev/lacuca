import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';

import { DatosVideotest, DatosCorte } from '../interfaces/data.interface';
import { OperationsService } from './operations.service';
import { environment } from 'src/environments/environment';
import { CortesService } from './cortes.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideotestService {

  constructor(
    private http: HttpClient,
    private operationService: OperationsService,
    private cortesService: CortesService
  ) { }

  registrarVideotest(datosVideotest: DatosVideotest): Observable<any> {
    return this.http.post(`${environment.herokuUrl}/videotest/`, datosVideotest, 
      {headers: {'token': this.operationService.getToken()}});
  }

  eliminarVideotest(idVideotest: string): Observable<any> {
    return this.http.delete(`${environment.herokuUrl}/videotest/${idVideotest}`,
      {headers: {'token': this.operationService.getToken()}});
  }

  modificarVideotest(datosVideotest: DatosVideotest): Observable<any> {
    return this.http.put(`${environment.herokuUrl}/videotest/${datosVideotest._id}`, datosVideotest,
      {headers: {'token': this.operationService.getToken()}});
  }

  obtenerDatosVideotest(idVideotest: string) {
    return this.http.get(`${environment.herokuUrl}/videotest/${idVideotest}`,
      {headers: {'token': this.operationService.getToken()}});
  }

  // Obtiene también los datos de los cortes asociados a las preguntas
  obtenerDatosCompletosVideotest(idVideotest: string): Observable<any> {
    var videotest: DatosVideotest;
    return this.http.get<any>(`${environment.herokuUrl}/videotest/${idVideotest}`,
      {headers: {'token': this.operationService.getToken()}})
      .pipe(
        switchMap( datosVideotestResp => {
          videotest = datosVideotestResp;
          var vObs: Observable<any>[] = []

          videotest.preguntas?.forEach( pregunta => {
            vObs.push(this.cortesService.obtenerDatosCompletosCorte(pregunta.idCorte));
          })

          return forkJoin(vObs);
        }),
        switchMap( listadoCompletoCortesResp => {
          videotest.preguntas?.forEach( pregunta => {
            listadoCompletoCortesResp.forEach( corte => {
              if (corte._id === pregunta.idCorte) {
                pregunta.corte = corte;
              }
            })
          })

          return of(videotest);
        })
      )
  }

  obtenerListadoCompletoVideotest(): Observable<any> {
    return this.http.get(`${environment.herokuUrl}/videotest`,
      {headers: {'token': this.operationService.getToken()}});
  }


  // Métodos adiccionales


}
