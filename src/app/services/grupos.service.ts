import { Injectable } from '@angular/core';
import { DatosGrupo } from '../interfaces/data.interface';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OperationsService } from './operations.service';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  datosGrupo?: DatosGrupo;
  listadoGrupo?: DatosGrupo[];

  constructor(
    private operationsService: OperationsService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  registrarGrupo(datosGrupo: DatosGrupo): Observable<any> {
    return this.http.post(`${environment.herokuUrl}/grupo/`, datosGrupo,
      { headers: { 'token': this.operationsService.getToken() }});
  }

  obtenerListadoGrupos(): Observable<DatosGrupo[]> {
    return this.http.get<DatosGrupo[]>(`${environment.herokuUrl}/grupo/`,
    { headers: { 'token': this.operationsService.getToken() }});
  }

  obtenerListadoGruposConDatos(): Observable<DatosGrupo[]> {
    return this.http.get<DatosGrupo[]>(`${environment.herokuUrl}/grupo/`,
    { headers: { 'token': this.operationsService.getToken() }}).pipe(
      switchMap( listadoGruposResp => this.asignarListadoGruposYObtenerResponsables(listadoGruposResp)),
      switchMap( listadoUsuariosResp => this.asignarResponsableYDevolverListado(listadoUsuariosResp))
    )
  }

  obtenerGrupo(idGrupo: string): Observable<DatosGrupo> {
    return this.http.get<DatosGrupo>(`${environment.herokuUrl}/grupo/${idGrupo}`,
    { headers: { 'token': this.operationsService.getToken() }});
  }

  obtenerGrupoConDatos(idGrupo: string): Observable<DatosGrupo> {
    return this.http.get<DatosGrupo>(`${environment.herokuUrl}/grupo/${idGrupo}`,
      { headers: { 'token': this.operationsService.getToken() }}).pipe(
        switchMap( datosGrupoResp => this.asignarGrupoYObtenerResponsables(datosGrupoResp) ),
        switchMap( listadoUsuariosResp => this.asignarResponsablesYDevolverGrupo(listadoUsuariosResp))
      )
  }

  eliminarGrupo(idGrupo: string): Observable<any> {
    return this.http.delete(`${environment.herokuUrl}/grupo/${idGrupo}`,
    { headers: { 'token': this.operationsService.getToken() }});
  }

  actualizarGrupo(datosGrupo: DatosGrupo): Observable<any> {
    return this.http.put(`${environment.herokuUrl}/grupo/${datosGrupo._id}`, datosGrupo,
    { headers: { 'token': this.operationsService.getToken() }});
  }

  // Métodos auxiliares
  asignarGrupoYObtenerResponsables(datosGrupo: DatosGrupo): Observable<any> {
    this.datosGrupo = datosGrupo;
    return this.authService.herokuGetUserListProtected();
  }

  asignarListadoGruposYObtenerResponsables(listadoGrupos: DatosGrupo[]): Observable<any> {
    this.listadoGrupo = listadoGrupos;
    return this.authService.herokuGetUserListProtected();
  }

  asignarResponsableYDevolverListado(listadoUsuarios: Usuario[]): Observable<DatosGrupo[]> {
    listadoUsuarios.forEach( usuario => {
      this.listadoGrupo?.forEach( grupo => {
        grupo.responsables!.forEach( responsableId => {
          if (responsableId === usuario._id) {
            if (grupo.datosResponsables === undefined) {
              grupo.datosResponsables = [];
            }
            grupo.datosResponsables.push(usuario);
          }
        })
      })
    })

    return of(this.listadoGrupo!);
  }  

  asignarResponsablesYDevolverGrupo(listadoUsuarios: Usuario[]): Observable<DatosGrupo> {
    listadoUsuarios.forEach( usuario => {
      this.datosGrupo!.responsables!.forEach( responsableId => {
        if (responsableId === usuario._id) {
          this.datosGrupo!.datosResponsables!.push(usuario);
        }
      })
    })

    return of(this.datosGrupo!);
  }

}
