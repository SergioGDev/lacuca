import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  BASE_URL = environment.herokuUrl;

  // Obtenemos el usuario actual
  getCurrentUserRol(): string | null{
    return localStorage.getItem('currentUserRol');
  }

  // Deslogea a un usuario en la plataforma
  logout() {
    localStorage.removeItem('token');
  }

  herokuLogin(nif: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/login`, {
      nif,
      password
    })
    .pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );  
  }

  herokuNewUser(user: User): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/new`, user);
  }

  herokuUpdateUser(user: User): Observable<any> { 
    const token = localStorage.getItem('token') || '';
    return this.http.put(`${this.BASE_URL}/auth/update/${user._id}`, user, {headers: {'token': token}});
  }

  herokuRenew(): Observable<any> {
    if(!localStorage.getItem('token')){
      return of(false);
    }

    const token = localStorage.getItem('token') || '';
    return this.http.get(`${this.BASE_URL}/auth/renew`, {headers: {'token': token}});
  }

  herokuChangePassword(nif: string, oldPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.post(`${this.BASE_URL}/auth/change-password`, {
      nif,
      oldPassword,
      newPassword
    }, {headers: {'token': token}});
  }

  herokuValidarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${this.BASE_URL}/auth/renew`, {headers: {'token': token}})
    .pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map(resp => true),
      catchError(err => of(false))
      
    );
  }

  herokuValidarIsAdmin(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${this.BASE_URL}/auth/renew`, {headers: {'token': token}})
    .pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map(resp => {
        return resp.user.role.includes('ROLE_ADMIN');
      }),
      catchError(err => of(false))
      
    );
  }

  herokuValidarIsInformador(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${this.BASE_URL}/auth/renew`, {headers: {'token': token}})
    .pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map(resp => {
        return resp.user.role.includes('ROLE_INFORMADOR');
      }),
      catchError(err => of(false))
      
    );
  }

  herokuGetUserList(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/auth/user`);
  }

  herokuGetUserListProtected(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${this.BASE_URL}/usuario`, {headers: {'token': token}});
  }

  herokuGetUserProtected(idUser: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${this.BASE_URL}/usuario/${idUser}`, {headers: {'token': token}});
  }
}
