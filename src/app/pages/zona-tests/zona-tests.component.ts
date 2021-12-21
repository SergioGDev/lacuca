import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lStorageNumeroPreguntas } from '../../interfaces/constantes.interface';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-zona-tests',
  templateUrl: './zona-tests.component.html',
  styleUrls: ['./zona-tests.component.css']
})
export class ZonaTestsComponent implements OnInit {

  numeroPreguntasForm: FormGroup = this.fb.group({
    rbNumeroPreguntas: [ , Validators.required ]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  generarTest() {
    if (this.numeroPreguntasForm.invalid) {
      console.log('Form invalid', this.numeroPreguntasForm);
      console.log(this.numeroPreguntasForm.value);
      return;
    }

    const numeroPreguntas = this.numeroPreguntasForm.value['rbNumeroPreguntas'];
    console.log("Nº preguntas:", numeroPreguntas);
    localStorage.setItem(lStorageNumeroPreguntas, `${numeroPreguntas}`);
    this.router.navigateByUrl(`dashboard/zona-tests/nuevo-test`);
  }

}
