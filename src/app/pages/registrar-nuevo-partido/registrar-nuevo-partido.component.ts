import { Component, OnInit, OnDestroy } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';

import { DatosPartido } from '../../interfaces/data.interface';
import { OperationsService } from '../../services/operations.service';
import { InterdataService } from '../../services/interdata.service';
import { DialogModificarComponent } from '../../components/dialog-modificar/dialog-modificar.component';
import { DialogRegistrarComponent } from '../../components/dialog-registrar/dialog-registrar.component';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { PartidosService } from '../../services/partidos.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-registrar-nuevo-partido',
  templateUrl: './registrar-nuevo-partido.component.html',
  styleUrls: ['../pages.component.css', './registrar-nuevo-partido.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class RegistrarNuevoPartidoComponent implements OnInit {

  formNuevoVideo: FormGroup = this.fb.group({
    equipoLocal: ['', Validators.required],
    equipoVisitante: ['', Validators.required],
    fecha: ['', Validators.required],
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
    private partidosService: PartidosService,
    private operationsService: OperationsService,
    private interdataService: InterdataService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.formNuevoVideo.get('fecha')?.addValidators(Validators.required);

    if (!this.router.url.includes('modificar-partido')) {
      return;
    }

    const idPartido = this.interdataService.getIdPartidoFromCache();
    if (idPartido) {
      this.partidosService.obtenerDatosPartido(idPartido)
        .subscribe(({ partido }) => {
          this.datosPartido = partido;

          this.formNuevoVideo.setValue({
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
      this.dialog.open(DialogModificarComponent,
        { 
          restoreFocus: false, 
          data: { modificado: false, mensajeDialog: '¿Desea modificar los datos del partido?' } 
        }) :
      this.dialog.open(DialogRegistrarComponent,
        { 
          restoreFocus: false, 
          data: { registrado: false, mensajeDialog: '¿Desea registrar los datos del partido?' } 
        });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.datosPartido ? 
          this.modificarDatosPartido() : 
          this.registrarNuevoPartido();
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

    this.partidosService.modificarDatosPartido(datosPartido)
      .subscribe(({ partido }) => {
        this.interdataService.setIdPartidoToCache(partido._id);
        this.router.navigateByUrl(`/dashboard/partidos/partido`);

        this.dialog.open(DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: `Los datos del partido ${datosPartido.equipoLocal} - ${datosPartido.equipoVisitante} han sido actualizados correctamente.`
          })
      }, err => {
        console.log(err);
        this.dialog.open(DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'Debido a un error inesperado no se ha podido modificar los datos del partido. Inténtelo de nuevo más tarde. Contante con el administrador del sitio.'
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

    this.partidosService.guardarPartido(datosPartido)
      .subscribe(({ partido }) => {
        this.interdataService.setIdPartidoToCache(partido._id);
        this.router.navigateByUrl(`/dashboard/partidos/partido`);

        this.dialog.open(DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'El partido se ha registrado correctamente.'
          });

      }, err => {
        console.log(err);

        this.dialog.open(DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'Debido a un error inesperado no se ha podido registrar el partido. Inténtelo de nuevo más tarde. Contacte con el administrador del sitio.'
          });

      });
  }
}
