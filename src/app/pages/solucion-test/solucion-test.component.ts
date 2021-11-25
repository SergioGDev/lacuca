import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemPregunta } from '../../interfaces/data.interface';
import { lStorageVPreguntasFalladas, lStorageVMisRespuestas } from '../../interfaces/constantes.interface';

@Component({
  selector: 'app-solucion-test',
  templateUrl: './solucion-test.component.html',
  styles: [
  ]
})
export class SolucionTestComponent implements OnInit, OnDestroy {

  vPreguntasFalladas: ItemPregunta[] = [];
  vMisRespuestas: string[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const itemPreguntas = localStorage.getItem(lStorageVPreguntasFalladas);
    const itemRespuestas = localStorage.getItem(lStorageVMisRespuestas);

    if (itemPreguntas && itemRespuestas) {
      
      this.vPreguntasFalladas = JSON.parse(itemPreguntas!);
      this.vMisRespuestas = JSON.parse(itemRespuestas!);

    } else {
      this.router.navigateByUrl('/dashboard/inicio')
    } 

  }

  ngOnDestroy(): void {
    
    localStorage.removeItem(lStorageVMisRespuestas);
    localStorage.removeItem(lStorageVPreguntasFalladas);

  }

}
