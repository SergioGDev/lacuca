import { Injectable } from '@angular/core';
import { lStorageTestAleatorio, lStorageIdPartido, lStorageIdCorte } from '../interfaces/constantes.interface';

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
}