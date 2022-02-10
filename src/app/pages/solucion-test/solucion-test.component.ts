import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ItemPreguntaRespondida } from '../../interfaces/data.interface';
import { lStorageVSoluciones, lStorageNumeroPreguntas } from '../../interfaces/constantes.interface';

@Component({
  selector: 'app-solucion-test',
  templateUrl: './solucion-test.component.html',
  styleUrls: ['./solucion-test.component.css']
})
export class SolucionTestComponent implements OnInit, OnDestroy {

  vMisRespuestas: ItemPreguntaRespondida[] = [];
  mensajeNumeroAciertos: string = "";

  numeroPreguntas: number = 0;
  preguntasAcertadas: number = 0;

  constructor(
    private router: Router
  ) { }

  // ng onInit
  ngOnInit(): void {
    const itemRespuestas = localStorage.getItem(lStorageVSoluciones);

    if (itemRespuestas) {
      this.vMisRespuestas = JSON.parse(itemRespuestas!);
      this.numeroPreguntas = parseInt(localStorage.getItem(lStorageNumeroPreguntas)!);
      this.preguntasAcertadas = this.numeroPreguntas - this.vMisRespuestas.length;

      this.mensajeNumeroAciertos = (this.numeroPreguntas === 1) ?
        (this.preguntasAcertadas === 1 ? '¡Respuesta correcta!' : 'Respuesta incorrecta') :
        `Has acertado ${this.preguntasAcertadas} de ${this.numeroPreguntas} 
        ${this.numeroPreguntas === 1 ? 'pregunta' : 'preguntas'}`;

    } else {
      this.router.navigateByUrl('/dashboard/inicio')
    } 
  }

  // ng onDestroy
  ngOnDestroy(): void {
    localStorage.removeItem(lStorageVSoluciones);
  }

  terminarTest(): void {
    this.router.navigateByUrl('/dashboard/inicio');
  }

  verMisResultados(): void {
    // NO IMPLEMENTADO
  }

  realizarOtroTest(): void {
    this.router.navigateByUrl('dashboard/zona-tests')
  }

}
