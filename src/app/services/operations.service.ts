import { Injectable } from '@angular/core';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { DatosFiltroVideotest, DatosCorte } from '../interfaces/data.interface';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor() { }

  /* Dada una URL, devuelve el ID del video de YouTube asociado */
  getYouTubeID(url: string) {
    const s1: string = 'https://www.youtube.com/watch?v=';
    const s2: string = 'www.youtube.com/watch?v=';
    const s3: string = 'youtube.com/watch?v=';
    const s4: string = 'https://www.youtube.com/embed/';

    if (url.startsWith(s1) || url.startsWith(s2) || url.startsWith(s3)) {
      return url.split(s3)[1].split('&')[0];

    } else if (url.startsWith(s4)) {
      // Proviene de una URL de IFRAME
      return url.split(s4)[1]
    } else {
      return '';
    }
  }

  checkYouTubeURL(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : false;
  }


  /***************************************************/
  /********     OBTENER TOKEN                  *******/
  /***************************************************/
  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  /***************************************************/
  /********     OPERACIONES USUARIOS           *******/
  /***************************************************/
  nombreCompletoUsuario(usuario: Usuario): string {
    return `${usuario.nombre} ${usuario.apellidos}`;
  }

  /***************************************************/
  /********     OPERACIONES FILTROS CORTES     *******/
  /***************************************************/
  esFiltroSinValoracion(filtro: DatosFiltroVideotest): boolean {
    return (!filtro.posicion || filtro.posicion.length === 0) &&
      (!filtro.tipo || filtro.tipo.length === 0) &&
      (!filtro.valoracion || filtro.valoracion.length === 0) &&
      (!filtro.situacion || filtro.situacion.length === 0) &&
      (filtro.checkValoracion);
  }

  esCorteSinValoracion(corte: DatosCorte): boolean {
    return (!corte.valoracion && !corte.posicion && !corte.tipo && !corte.situacion);
  }

  corteContieneSituacionFiltro(corte: DatosCorte, filtro: DatosFiltroVideotest): boolean {
    var flag: boolean = false;
    if (filtro.situacion && filtro.situacion.length > 0) {
      filtro.situacion.forEach(dato => {
        if (corte.situacion?.includes(dato)) {
          flag = true
        }
      })
    } else if (!filtro.situacion) {
      flag = true;
    } else if (filtro.situacion.length === 0) {
      flag = true;
    }
    
    return flag;
  }

  corteContieneValoracionFiltro(corte: DatosCorte, filtro: DatosFiltroVideotest): boolean {
    var flag: boolean = false;
    if (filtro.valoracion && filtro.valoracion.length > 0) {
        filtro.valoracion.forEach(dato => {
          if (corte.valoracion?.includes(dato)) {
            flag = true;
          }
        })
    } else if (!filtro.valoracion) {
      flag = true;
    } else if (filtro.valoracion.length === 0) {
      flag = true;
    }

    return flag;
  }

  corteContieneTipoFiltro(corte: DatosCorte, filtro: DatosFiltroVideotest): boolean {
    var flag: boolean = false;
    if (filtro.tipo && filtro.tipo.length > 0) {
      filtro.tipo.forEach(dato => {
        if (corte.tipo === dato) {
          flag = true;
        }
      })
    } else if (!filtro.tipo) {
      flag = true;
    } else if (filtro.tipo.length === 0) {
      flag = true;
    }
    

    return flag;
  }

  corteContienePosicionFiltro(corte: DatosCorte, filtro: DatosFiltroVideotest): boolean {
    var flag: boolean = false;
    if (filtro.posicion && filtro.posicion.length > 0) {
      filtro.posicion.forEach(dato => {
        if (corte.posicion?.includes(dato)) {
          flag = true;
        }
      })
    } else if (!filtro.posicion) {
      flag = true;
    } else if (filtro.posicion.length === 0) {
      flag = true;
    }
    
    return flag;
  }

  // Obtiene la lista con los cortes sin valoración, aplicando el filtro del equipo
  obtenerListaFiltradaSinValoracion(listadoCortes: DatosCorte[], filtro: DatosFiltroVideotest): DatosCorte[] {
    var listadoFiltrado: DatosCorte[] = [];

    listadoCortes.forEach(corte => {
      if (this.esCorteSinValoracion(corte)) {

        if (!filtro.equipo || filtro.equipo.length === 0) {
          listadoFiltrado.push(corte);
        } else if (corte.datosPartido?.equipoLocal.toLowerCase().includes(filtro.equipo.toLowerCase()) || 
          corte.datosPartido?.equipoVisitante.toLowerCase().includes(filtro.equipo.toLowerCase())) {
          listadoFiltrado.push(corte);
        }

      }
    });

    return listadoFiltrado;
  }

  // Obtiene la lista filtrada con los cortes que apliquen el filtro completo
  obtenerListaFiltradaConValoracion(listadoCortes: DatosCorte[], filtro: DatosFiltroVideotest): DatosCorte[] {
    var listadoFiltrado: DatosCorte[] = [];

    listadoCortes.forEach(corte => {
      // Comprobamos check "Cortes con valoración"
      if (!this.esCorteSinValoracion(corte)) {

        // Comprobamos los filtros
        if (this.corteContieneValoracionFiltro(corte, filtro) &&
          this.corteContienePosicionFiltro(corte, filtro) &&
          this.corteContieneTipoFiltro(corte, filtro) &&
          this.corteContieneSituacionFiltro(corte, filtro)) {

            // Comprobamos el texto del equipo
            if (!filtro.equipo || filtro.equipo.length === 0) {
              listadoFiltrado.push(corte);
            } else if (corte.datosPartido?.equipoLocal.toLowerCase().includes(filtro.equipo.toLowerCase()) || 
              corte.datosPartido?.equipoVisitante.toLowerCase().includes(filtro.equipo.toLowerCase())) {
              listadoFiltrado.push(corte);
            }
        }
      }

    });

    return listadoFiltrado;
  }

  // Obtiene la lista filtrada según los checks del filtro
  filtrarLista(listadoCortes: DatosCorte[], filtro: DatosFiltroVideotest): DatosCorte[] {
    if (filtro.checkValoracion) {
      return this.obtenerListaFiltradaConValoracion(listadoCortes, filtro);
    } else {
      return this.obtenerListaFiltradaSinValoracion(listadoCortes, filtro);
    }
  }
}
