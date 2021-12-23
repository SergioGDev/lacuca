import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { DatosPartido } from '../../interfaces/data.interface';
import Swal from 'sweetalert2';
import { OperationsService } from '../../services/operations.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-registrar-nuevo-partido',
  templateUrl: './registrar-nuevo-partido.component.html',
  styleUrls: ['../pages.component.css', './registrar-nuevo-partido.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ] 
})
export class RegistrarNuevoPartidoComponent implements OnInit {

  formNuevoVideo: FormGroup = this.fb.group({
    equipoLocal:      [ 'Equipo Local', Validators.required ],
    equipoVisitante:  [ 'Equipo Visitante', Validators.required ],
    fecha:            [  , Validators.required ],
    localidad:        [ 'Plasencia', Validators.required ],
    url:              [ '', [ Validators.required ] ],
    fase:             [ 'Semifinal', Validators.required ],
    jornada:          [ 1, Validators.required ],
    comentario:       [ '' ],
  }, {
    validators: this.isYoutube()
  });
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private operationsService: OperationsService
  ) { }

  ngOnInit(): void {
  }

  volver(): void {
    this.router.navigateByUrl('/dashboard/videos')
  }

  isYoutube () {
    return ( formGroup: FormGroup) => {
      const url = formGroup.get('url');
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url?.value.match(regExp);
      const check = (match && match[2].length === 11) ? match[2] : false;
      url?.setErrors(!check ? {youtubeUrlNoValid: true} : null);
    }
  }

  registrarNuevoPartido() {
    if (this.formNuevoVideo.invalid) {
      this.formNuevoVideo.markAllAsTouched();
      return;
    }

    const youtubeID = this.operationsService.getYouTubeID(this.formNuevoVideo.value['url']);

    if (youtubeID === '') {
      this.formNuevoVideo.markAllAsTouched();
      return;
    }

    const datosPartido: DatosPartido = {
      equipoLocal:      this.formNuevoVideo.value['equipoLocal'],
      equipoVisitante:  this.formNuevoVideo.value['equipoVisitante'],
      fechaHora:        this.formNuevoVideo.value['fecha'],
      localidad:        this.formNuevoVideo.value['localidad'],
      url:              youtubeID,
      fase:             this.formNuevoVideo.value['fase'],
      jornada:          this.formNuevoVideo.value['jornada'],
      comentario:       this.formNuevoVideo.value['comentario'],
      status:           true
    }

    this.dataService.guardarPartido(datosPartido)
      .subscribe( () => {
        this.router.navigateByUrl('/dashboard/videos');

        Swal.fire({
          icon: 'success',
          title: 'Registro completado',
          text: 'El partido se ha registrado correctamente.'
        });
      }, () => {

        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un problema',
          text: 'Debido a un error inesperado no se ha podido registrar el partido. Inténtelo de nuevo más tarde.'
        })

      });

  }
}
