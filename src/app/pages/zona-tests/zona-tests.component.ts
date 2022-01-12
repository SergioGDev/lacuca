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

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  generarTest(numPreguntas: number) {
    localStorage.setItem(lStorageNumeroPreguntas, `${numPreguntas}`);
    this.router.navigateByUrl(`dashboard/zona-tests/nuevo-test`);
  }

  irPanelAdministracionVideotest() {
    this.router.navigateByUrl('dashboard/zona-tests/admin-videotest');
  }

}
