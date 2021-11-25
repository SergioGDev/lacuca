import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from '../../services/data.service';
import { ItemPregunta } from '../../interfaces/data.interface';
import { Validators, FormGroup, FormBuilder, FormControl, CheckboxRequiredValidator } from '@angular/forms';
import { lStorageVPreguntasFalladas, lStorageVMisRespuestas, lStorageNumeroPreguntas, lStorageTestAleatorio } from '../../interfaces/constantes.interface';

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

  ngOnInit(): void {
    const numeroPreguntas: number = parseInt(localStorage.getItem(lStorageNumeroPreguntas)!);
    localStorage.removeItem(lStorageNumeroPreguntas);

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

  getFormControlName(numeroPregunta: number) {
    return `pregunta-${numeroPregunta}`;
  }

  getIdRespuesta(numeroPregunta: number, numeroRespuesta: number) {
    return `pregunta-${numeroPregunta}-respuesta-${numeroRespuesta}`;
  }

  enviarTest(): void {
    var vPReguntasFalladas: ItemPregunta[] = [];
    var vMisRespuestas: string[] = [];

    for (var i = 0; i < this.vPreguntas.length; i++) {

      if (this.vPreguntas[i].correcta !== this.formTest.value[`pregunta-${i + 1}`]) {
        vPReguntasFalladas.push(this.vPreguntas[i]);
        vMisRespuestas.push(this.formTest.value[`pregunta-${i + 1}`]);
      }

      localStorage.setItem(lStorageVPreguntasFalladas, JSON.stringify(vPReguntasFalladas));
      localStorage.setItem(lStorageVMisRespuestas, JSON.stringify(vMisRespuestas));

      this.router.navigateByUrl('/dashboard/solucion-test');
    }

  } 
}
