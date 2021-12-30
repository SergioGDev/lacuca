import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { DataService } from '../../services/data.service';
import { DatosPartido } from '../../interfaces/data.interface';
import { OperationsService } from '../../services/operations.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogNuevoPartidoComponent } from '../../components/dialog-nuevo-partido/dialog-nuevo-partido.component';
import { DialogModificarPartidoComponent } from '../../components/dialog-modificar-partido/dialog-modificar-partido.component';
import { InterdataService } from '../../services/interdata.service';

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
    equipoLocal: ['', Validators.required],
    equipoVisitante: ['', Validators.required],
    fecha: [, Validators.required],
    localidad: ['', Validators.required],
    url: ['', [Validators.required]],
    fase: ['', Validators.required],
    jornada: [, Validators.required],
    comentario: [''],
  }, {
    validators: this.isYoutube()
  });

  datosPartido?: DatosPartido;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private operationsService: OperationsService,
    private interdataService: InterdataService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('modificar-partido')) {
      return;
    }

    const idPartido = this.interdataService.getIdPartidoFromCache();
    if (idPartido) {
      this.dataService.obtenerDatosPartido(idPartido)
        .subscribe(({ partido }) => {
          this.datosPartido = partido;

          this.formNuevoVideo.reset({
            equipoLocal: this.datosPartido!.equipoLocal,
            equipoVisitante: this.datosPartido!.equipoVisitante,
            fecha: this.datosPartido!.fechaHora,
            localidad: this.datosPartido!.localidad,
            url: `https://www.youtube.com/watch?v=${this.datosPartido!.url}`,
            fase: this.datosPartido!.fase,
            jornada: this.datosPartido!.jornada,
            comentario: this.datosPartido!.comentario
          })
        });
    } else {
      this.router.navigateByUrl('dashboard');
    }
  }

  ngOnDestroy(): void {
    this.interdataService.removeIdPartidoFromCache();
  }

  /***********      VOLVER      ***********/
  volver(): void {
    if (this.router.url.includes('modificar-partido')) {
      this.interdataService.setIdPartidoToCache(this.datosPartido?._id!);
      this.router.navigateByUrl(`/dashboard/partidos/partido`);
    } else if (this.router.url.includes('registrar-nuevo-partido')) {
      this.router.navigateByUrl('/dashboard/partidos');
    }
  }

  /***********      Comprueba que el enlace es de youtube      ***********/
  isYoutube() {
    return (formGroup: FormGroup) => {
      const url = formGroup.get('url');
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url?.value.match(regExp);
      const check = (match && match[2].length === 11) ? match[2] : false;
      url?.setErrors(!check ? { youtubeUrlNoValid: true } : null);
    }
  }

  /***********      SUBMIT      ***********/
  submit() {
    if (this.formNuevoVideo.invalid) {
      this.formNuevoVideo.markAllAsTouched();
      return;
    }

    const dialogRef = this.datosPartido ?
      this.dialog.open(DialogModificarPartidoComponent,
        { restoreFocus: false, data: { modificado: false } }) :
      this.dialog.open(DialogNuevoPartidoComponent,
        { restoreFocus: false, data: { guardado: false } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.modificarDatosPartido();
      }
    });
  }

  /***********      MODIFICAR      ***********/
  modificarDatosPartido() {
    const youtubeID = this.operationsService.getYouTubeID(this.formNuevoVideo.value['url']);

    if (youtubeID === '') {
      this.formNuevoVideo.markAllAsTouched();
      return;
    }

    const datosPartido: DatosPartido = {
      _id: this.datosPartido?._id,
      equipoLocal: this.formNuevoVideo.value['equipoLocal'],
      equipoVisitante: this.formNuevoVideo.value['equipoVisitante'],
      fechaHora: this.formNuevoVideo.value['fecha'],
      localidad: this.formNuevoVideo.value['localidad'],
      url: youtubeID,
      fase: this.formNuevoVideo.value['fase'],
      jornada: this.formNuevoVideo.value['jornada'],
      comentario: this.formNuevoVideo.value['comentario'],
      status: true
    }

    datosPartido.equipoLocal = datosPartido.equipoLocal.toUpperCase();
    datosPartido.equipoVisitante = datosPartido.equipoVisitante.toUpperCase();

    this.dataService.modificarDatosPartido(datosPartido)
      .subscribe(({ partido }) => {
        this.interdataService.setIdPartidoToCache(partido._id);
        this.router.navigateByUrl(`/dashboard/partidos/partido`);

        Swal.fire({
          icon: 'success',
          title: 'Modificación completada',
          text: `Los datos del partido ${datosPartido.equipoLocal} - ${datosPartido.equipoVisitante} han sido actualizados correctamente.`
        });
      }, err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un problema',
          text: 'Debido a un error inesperado no se ha podido modificar los datos del partido. Inténtelo de nuevo más tarde.'
        })

      });
  }

  /***********      REGISTRAR      ***********/
  registrarNuevoPartido() {

    const youtubeID = this.operationsService.getYouTubeID(this.formNuevoVideo.value['url']);

    if (youtubeID === '') {
      this.formNuevoVideo.markAllAsTouched();
      return;
    }

    const datosPartido: DatosPartido = {
      equipoLocal: this.formNuevoVideo.value['equipoLocal'],
      equipoVisitante: this.formNuevoVideo.value['equipoVisitante'],
      fechaHora: this.formNuevoVideo.value['fecha'],
      localidad: this.formNuevoVideo.value['localidad'],
      url: youtubeID,
      fase: this.formNuevoVideo.value['fase'],
      jornada: this.formNuevoVideo.value['jornada'],
      comentario: this.formNuevoVideo.value['comentario'],
      status: true
    }

    datosPartido.equipoLocal = datosPartido.equipoLocal.toUpperCase();
    datosPartido.equipoVisitante = datosPartido.equipoVisitante.toUpperCase();

    this.dataService.guardarPartido(datosPartido)
      .subscribe(({ partido }) => {
        this.interdataService.setIdPartidoToCache(partido._id);
        this.router.navigateByUrl(`/dashboard/partidos/partido`);

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
