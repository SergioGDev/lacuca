import { Injectable } from '@angular/core';
import { lStorageIdPartido, lStorageIdCorte, lStorageUser, lStorageIdInforme, lStorageCortesInforme, lStorageIdVideotest, lStorageIdGrupo } from '../interfaces/constantes.interface';
import { LSCortesInforme } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class InterdataService {

  constructor() { }

  // Método para limpiar la caché completa
  limpiarCache() {
    this.removeCortesInformeFromCache();
    this.removeIdCorteFromCache();
    this.removeIdInformeFromCache();
    this.removeIdPartidoFromCache();
  }

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

  // ID INFOMRE
  setIdInformeToCache(idInforme: string) {
    localStorage.setItem(lStorageIdInforme, idInforme);
  }

  getIdInformeFromCache(): string | null {
    return localStorage.getItem(lStorageIdInforme);
  }

  removeIdInformeFromCache() {
    localStorage.removeItem(lStorageIdInforme);
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
  
  // Ids cortes del informe
  setCortesInformeFromCache(cortesInforme: LSCortesInforme) {
    localStorage.setItem(lStorageCortesInforme, JSON.stringify(cortesInforme));
  }

  getCortesInformeFromCache() {
    const cortesInforme = localStorage.getItem(lStorageCortesInforme);
    return cortesInforme ? JSON.parse(cortesInforme) : undefined;
  }
  
  removeCortesInformeFromCache() {
    localStorage.removeItem(lStorageCortesInforme);
  }

  // ID VIDEOTESTS
  setIdVideotestToCache(idVideotest: string) {
    localStorage.setItem(lStorageIdVideotest, idVideotest);
  }

  getIdVideotestFromCache(): string | null {
    return localStorage.getItem(lStorageIdVideotest);
  }

  removeIdVideotestFromCache() {
    localStorage.removeItem(lStorageIdVideotest);
  }

  // ID GRUPO
  setIdGrupoToCache(idGrupo: string) {
    localStorage.setItem(lStorageIdGrupo, idGrupo);
  }

  getIdGrupoFromCache(): string | null {
    return localStorage.getItem(lStorageIdGrupo);
  }

  removeIdGrupoFromCache() {
    localStorage.removeItem(lStorageIdGrupo);
  }
}
