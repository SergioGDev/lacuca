import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    this.router.navigateByUrl(`dashboard/nuevo-test/${numeroPreguntas}`);
  }

}
