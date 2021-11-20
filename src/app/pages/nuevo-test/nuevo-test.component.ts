import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';
import { ItemPregunta } from '../../interfaces/data.interface';
import { Validators, FormGroup, FormBuilder, FormControl, CheckboxRequiredValidator } from '@angular/forms';

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
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (param) => {
        console.log(param.numeroPreguntas);
        if (this.dataService.getVPreguntas().length == 0) {
          this.dataService.almacenarPreguntasEnVPreguntas();
        }
        this.vPreguntas = this.dataService.getTestAleatorio(param.numeroPreguntas);
        if (this.vPreguntas.length > 0) {
          localStorage.setItem('testAleatorio', JSON.stringify(this.vPreguntas));
        } else {
          this.vPreguntas = JSON.parse(localStorage.getItem('testAleatorio')!);
        }

        for (let i = 1; i <= this.vPreguntas.length; i++) {
          this.formTest.addControl(`pregunta-${i}`, new FormControl(Validators.requiredTrue))
        }
        
        console.log(this.formTest);
      }
    )
  }

  getFormControlName(numeroPregunta: number) {
    return `pregunta-${numeroPregunta}`;
  }

  getIdRespuesta(numeroPregunta: number, numeroRespuesta: number) {
    return `pregunta-${numeroPregunta}-respuesta-${numeroRespuesta}`;
  }

  enviarTest(): void {
    console.log(this.formTest.invalid ? "Inválido" : "Válido");
  }

}
