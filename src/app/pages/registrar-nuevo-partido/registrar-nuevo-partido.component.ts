import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { DatosPartido } from '../../interfaces/data.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-nuevo-partido',
  templateUrl: './registrar-nuevo-partido.component.html',
  styleUrls: ['../pages.component.css', './registrar-nuevo-partido.component.css']
})
export class RegistrarNuevoPartidoComponent implements OnInit {

  formNuevoVideo: FormGroup = this.fb.group({
    equipoLocal:      [ '', Validators.required ],
    equipoVisitante:  [ '', Validators.required ],
    fecha:            [ '', Validators.required ],
    localidad:        [ '', Validators.required ],
    url:              [ '', Validators.required ],
  });
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  volver(): void {
    this.router.navigateByUrl('/dashboard/videos')
  }

  registrarNuevoPartido() {
    if (this.formNuevoVideo.invalid) {
      this.formNuevoVideo.markAllAsTouched();
      return;
    }

    const datosPartido: DatosPartido = {
      equipoLocal:      this.formNuevoVideo.value['equipoLocal'],
      equipoVisitante:  this.formNuevoVideo.value['equipoVisitante'],
      fechaHora:        this.formNuevoVideo.value['fecha'],
      localidad:        this.formNuevoVideo.value['localidad'],
      url:              this.formNuevoVideo.value['url'],
      status:           true,
      fase:             '',
      jornada:          0,
      comentario:       ''
    }

    this.dataService.guardarPartido(datosPartido)
      .subscribe( () => {
        this.router.navigateByUrl('/dashboard/videos');
      }, () => {

        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un problema',
          text: 'Debido a un error inesperado no se ha podido registrar el partido. Inténtelo de nuevo más tarde.'
        })

      });

  }
}
