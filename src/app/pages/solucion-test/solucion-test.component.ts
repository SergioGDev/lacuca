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

  constructor(
    private router: Router
  ) { }

  // ng onInit
  ngOnInit(): void {
    const itemRespuestas = localStorage.getItem(lStorageVSoluciones);
    
    if (itemRespuestas) {
      this.vMisRespuestas = JSON.parse(itemRespuestas!);
      const numeroPreguntas: number = parseInt(localStorage.getItem(lStorageNumeroPreguntas)!);
      const preguntasAcertadas: number = numeroPreguntas - this.vMisRespuestas.length;

      this.mensajeNumeroAciertos = `Has acertado ${preguntasAcertadas} 
        de ${numeroPreguntas} ${numeroPreguntas === 1 ? 'pregunta' : 'preguntas'}`;

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
    console.log("NO IMPLEMENTADO");
  }

  realizarOtroTest(): void {
    this.router.navigateByUrl('dashboard/zona-tests')
  }

}
