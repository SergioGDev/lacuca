import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DatosVideotest } from '../interfaces/data.interface';
import { OperationsService } from './operations.service';
import { environment } from 'src/environments/environment';
import { CortesService } from './cortes.service';

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
    this.http.get(`${environment.herokuUrl}/videotest/${idVideotest}`,
      {headers: {'token': this.operationService.getToken()}})
      .subscribe(resp => console.log(resp))
  }

  obtenerListadoCompletoVideotest(): Observable<any> {
    return this.http.get(`${environment.herokuUrl}/videotest`,
      {headers: {'token': this.operationService.getToken()}});
  }

  // Métodos adiccionales


}
