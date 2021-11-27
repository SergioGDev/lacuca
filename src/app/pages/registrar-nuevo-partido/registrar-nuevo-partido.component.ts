import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-nuevo-partido',
  templateUrl: './registrar-nuevo-partido.component.html',
  styleUrls: ['../pages.component.css', './registrar-nuevo-partido.component.css']
})
export class RegistrarNuevoPartidoComponent implements OnInit {

  formNuevoVideo: FormGroup = this.fb.group({
    equipoLocal:      [ "", Validators.required ],
    equipoVisitante:  [ "", Validators.required ],
    fecha:            [ "", Validators.required ],
    hora:             [ "", Validators.required ],
    localidad:        [ "", Validators.required ],
    enlace:           [ "", Validators.required ],
  })
  
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  volver(): void {
    this.router.navigateByUrl('/dashboard/videos')
  }
}
