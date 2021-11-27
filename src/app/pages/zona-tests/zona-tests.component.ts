import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lStorageNumeroPreguntas } from '../../interfaces/constantes.interface';

@Component({
  selector: 'app-zona-tests',
  templateUrl: './zona-tests.component.html',
  styleUrls: ['./zona-tests.component.css']
})
export class ZonaTestsComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  generarTest(numeroPreguntas: number) {
    localStorage.setItem(lStorageNumeroPreguntas, `${numeroPreguntas}`);
    this.router.navigateByUrl(`dashboard/zona-tests/nuevo-test`);
  }

}
