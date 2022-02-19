import { Injectable } from '@angular/core';

import { DatosRol } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  
  /* ****************************************** */
  /* ***********     SELECTS       ************ */
  /* ****************************************** */
  obtenerVValoracion(): string[] {
    return ['Correcta', 'Incorrecta']
  }

  obtenerVSituacion(): string[] {
    return [ 'Falta', 'Violación', 'No call', 'Falta no pitada', 'Violación no pitada', 'Mecánica' ];
  }

  obtenerVTipo(): string[] {
    return [ 'Acción Continua', 'Acción tiro','Agarra','Antideportiva','Ataque','Bloqueo','Campo atrás','Carga',
      'Descalificante','Doble regate','Empujar','Falta doble','Fuera de banda','Interferencia','Interposición',
      'Intuye','Manos','Pasos','Pie','Pos. defensa','Rebote','Simula','Técnica','Temporal','Vertical','Otras']
  }

  obtenerVPosicion(): string[] {
    return [ 'Cabeza', 'Cola', 'Cabeza - Cola', 'Cola - Cabeza']
  }

  obtenerVArbitro(): string[] {
    return [ 'Principal', 'Auxiliar', 'Ambos' ];
  }

  /* ****************************************** */
  /* ***********     OTROS         ************ */
  /* ****************************************** */
  obtenerVRoles(): DatosRol[] {
    return [
      { description: 'Administrador', value: 'ROLE_ADMIN' },
      { description: 'Informador', value: 'ROLE_INFORMADOR' },
      { description: 'Árbitro', value: 'ROLE_ARBITRO' },
    ] 
  }

  obtenerVDelegaciones(): string[] {
    return ['Norte', 'Cáceres', 'La Serena', 'Mérida', 'Badajoz', 'Sur', 'Almendralejo'];
  }
}
