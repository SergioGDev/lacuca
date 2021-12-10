import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from '../../services/data.service';
import { ItemPregunta, ItemPreguntaRespondida } from '../../interfaces/data.interface';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { lStorageNumeroPreguntas, lStorageTestAleatorio, lStorageVSoluciones } from '../../interfaces/constantes.interface';

@Component({
  selector: 'app-nuevo-test',
  templateUrl: './nuevo-test.component.html',
  styles: [
  ]
})
export class NuevoTestComponent implements OnInit {

  vPreguntas: ItemPregunta[] = [];
  formTest: FormGroup = this.fb.group({});

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  // NG ONINIT //
  ngOnInit(): void {
    const numeroPreguntas: number = parseInt(localStorage.getItem(lStorageNumeroPreguntas)!);

    if (this.dataService.getVPreguntas().length == 0) {
      this.dataService.almacenarPreguntasEnVPreguntas();
    }

    this.vPreguntas = this.dataService.getTestAleatorio(numeroPreguntas);
    // Si se ha recargado la página, se obtiene del localStorage
    if (this.vPreguntas.length > 0) {
      localStorage.setItem(lStorageTestAleatorio, JSON.stringify(this.vPreguntas));
    } else {
      this.vPreguntas = JSON.parse(localStorage.getItem(lStorageTestAleatorio)!);
    }

    for (let i = 1; i <= this.vPreguntas.length; i++) {
      this.formTest.addControl(`pregunta-${i}`, new FormControl('', Validators.required))
    }
  }

  // Obtiene el nombre del FormControl asignado a la pregunta
  getFormControlName(numeroPregunta: number) {
    return `pregunta-${numeroPregunta}`;
  }

  // Obtiene el ID de la respuesta para cada pregunta
  getIdRespuesta(numeroPregunta: number, numeroRespuesta: number) {
    return `pregunta-${numeroPregunta}-respuesta-${numeroRespuesta}`;
  }

  // Si se han respondido todas las preguntas, realiza el submit del test
  enviarTest(): void {
    if (this.formTest.invalid) {
      return;
    }

    var vSoluciones: ItemPreguntaRespondida[] = [];
    var vPReguntasFalladas: ItemPregunta[] = [];
    var vMisRespuestas: string[] = [];

    for (var i = 0; i < this.vPreguntas.length; i++) {

      if (this.vPreguntas[i].correcta !== this.formTest.value[`pregunta-${i + 1}`]) {
        vSoluciones.push({
          pregunta: this.vPreguntas[i],
          miRespuesta: this.formTest.value[`pregunta-${i + 1}`]
        })
      }

      localStorage.setItem(lStorageVSoluciones, JSON.stringify(vSoluciones));

      this.router.navigateByUrl('/dashboard/zona-tests/solucion-test');
    }

  } 
}