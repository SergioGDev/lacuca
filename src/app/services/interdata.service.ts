import { Injectable } from '@angular/core';
import { lStorageIdPartido, lStorageIdCorte, lStorageUser } from '../interfaces/constantes.interface';

@Injectable({
  providedIn: 'root'
})
export class InterdataService {

  constructor() { }

  // ID PARTIDO
  setIdPartidoToCache(idPartido: string) {
    localStorage.setItem(lStorageIdPartido, idPartido);
  }

  getIdPartidoFromCache(): string | null {
    return localStorage.getItem(lStorageIdPartido);
  }

  removeIdPartidoFromCache() {
    localStorage.removeItem(lStorageIdPartido);
  }

  // ID CORTE
  setIdCorteToCache(idCorte: string) {
    localStorage.setItem(lStorageIdCorte, idCorte);
  }

  getIdCorteFromCache(): string | null {
    return localStorage.getItem(lStorageIdCorte);
  }

  removeIdCorteFromCache() {
    localStorage.removeItem(lStorageIdCorte);
  }

  // USUARIO
  setUserToCache(user: any) {
    localStorage.setItem(lStorageUser, JSON.stringify(user));
  }

  getUserFromCache() {
    const JsonUser = localStorage.getItem(lStorageUser);
    return JsonUser ? JSON.parse(JsonUser) : undefined;
  }

  removeUserFromCache() {
    localStorage.removeItem(lStorageUser);
  }
  
}
