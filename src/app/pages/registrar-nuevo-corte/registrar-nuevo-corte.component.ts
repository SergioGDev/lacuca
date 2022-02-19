import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { DatosPartido, DatosCorte, HorMinSeg, TempoCorte } from '../../interfaces/data.interface';
import { DataService } from '../../services/data.service';
import { InterdataService } from '../../services/interdata.service';
import { DialogModificarComponent } from '../../components/dialog-modificar/dialog-modificar.component';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { DialogRegistrarComponent } from '../../components/dialog-registrar/dialog-registrar.component';
import { PartidosService } from '../../services/partidos.service';
import { CortesService } from '../../services/cortes.service';

@Component({
  selector: 'app-registrar-nuevo-corte',
  templateUrl: './registrar-nuevo-corte.component.html',
  styleUrls: ['./registrar-nuevo-corte.component.css']
})
export class RegistrarNuevoCorteComponent implements OnInit {

  datosPartido!: DatosPartido;
  datosCorte?: DatosCorte;
  urlIframe!: SafeResourceUrl;

  cargando: boolean = true;

  vValoracion: string[] = this.dataService.obtenerVValoracion();
  vSituacion: string[] = this.dataService.obtenerVSituacion();
  vTipo: string[] = this.dataService.obtenerVTipo();
  vPosicion: string[] = this.dataService.obtenerVPosicion();
  vArbitro: string[] = this.dataService.obtenerVArbitro();


  // Para indicar que se viene de un informe
  validacionesObligatorias: boolean = false;

  formNuevoCorte: FormGroup = this.fb.group({
    horaInicio: [ , [Validators.required, Validators.min(0)]],
    minInicio: [ , [Validators.required, Validators.min(0), Validators.max(60)]],
    segInicio: [ , [Validators.required, Validators.min(0), Validators.max(60)]],
    horaFin: [ , [Validators.required, Validators.min(0)]],
    minFin: [ , [Validators.required, Validators.min(0), Validators.max(60)]],
    segFin: [ , [Validators.required, Validators.min(0), Validators.max(60)]],
    checkMasInfo: [ ],
    comentario: [],
    valoracion: [],
    situacion: [],
    tipo: [],
    posicion: [],
    arbitro: [],
    checkOtroCorte: []
  }, {
    validators: [this.datosExtraValidator(), this.validarTiemposCorte()]
  })


  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dataService: DataService,
    private partidosService: PartidosService,
    private cortesService: CortesService,
    private interdataService: InterdataService
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    // Obtenemos los datos del partido
    const idPartido = this.interdataService.getIdPartidoFromCache();
    const idCorte = this.interdataService.getIdCorteFromCache();

    if (idPartido) {

      this.partidosService.obtenerDatosPartido(idPartido)
        .subscribe(({ partido }) => {
          this.datosPartido = partido;
          this.urlIframe = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.datosPartido.url}`);
        });

      // Si se modifica un corte, asignamos los datos la formulario
      if (!this.router.url.includes('modificar-corte') && !this.router.url.includes('informes/realizar-informe')) {
        this.cargando = false;
        return;
      }

      // Si se proviene de un informe, obligamos a que las validaciones haya que rellenarlas
      if (this.router.url.includes('informes/realizar-informe')) {
        this.validacionesObligatorias = true;
        this.formNuevoCorte.reset({
          checkMasInfo: true 
        })
        this.cargando = false;
        return;
      }

      if (idCorte) {
        this.cortesService.obtenerDatosCorte(idCorte)
          .subscribe((datosCorteRest: any) => {
            const {
              hIni, mIni, sIni, hFin, mFin, sFin
            } = this.obtenerTiempoInicioFin(datosCorteRest.segundoInicio, datosCorteRest.duracion);

            this.formNuevoCorte.setValue({
              horaInicio: hIni,
              minInicio: mIni,
              segInicio: sIni,
              horaFin: hFin,
              minFin: mFin,
              segFin: sFin,
              checkMasInfo: datosCorteRest.valoracion !== null,
              comentario: datosCorteRest.comentario,
              valoracion: datosCorteRest.valoracion,
              situacion: datosCorteRest.situacion,
              tipo: datosCorteRest.tipo,
              posicion: datosCorteRest.posicion,
              arbitro: datosCorteRest.arbitro,
              checkOtroCorte: false,
            });

            this.datosCorte = {
              _id: datosCorteRest._id,
              __v: datosCorteRest.__v,
              idPartido: idPartido,
              segundoInicio: datosCorteRest.segundoInicio,
              duracion: datosCorteRest.duracion,
              comentario: datosCorteRest.comentario,
              valoracion: datosCorteRest.valoracion,
              situacion: datosCorteRest.situacion,
              tipo: datosCorteRest.tipo,
              posicion: datosCorteRest.posicion,
              arbitro: datosCorteRest.arbitro
            }
            this.cargando = false;
          });


      } else {
        this.cargando = false;
        this.router.navigateByUrl('dashboard');
      }


    } else {
      this.cargando = false;
      this.router.navigateByUrl('dashboard');

    }

  }

  // Dado el segundo inicio y la duración, devuelve un objeto con el tiempo de inicio y fin
  obtenerTiempoInicioFin(segundoInicio: number, duracion: number): TempoCorte {
    const { horas: hIni, minutos: mIni, segundos: sIni } = this.obtenerHorasMinutosSegundos(segundoInicio);
    const { horas: hFin, minutos: mFin, segundos: sFin } = this.obtenerHorasMinutosSegundos(segundoInicio + duracion);

    return { hIni, mIni, sIni, hFin, mFin, sFin };
  }

  obtenerHorasMinutosSegundos(totalSegundos: number): HorMinSeg {
    const totalMin = Math.trunc(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    const horas = Math.trunc(totalMin / 60);
    const minutos = totalMin % 60;
    return { horas, minutos, segundos };
  }

  // Muestra los inputs en caso de que se quiera incluir la valoración del corte
  mostrarValoracionCorte() {
    return (this.formNuevoCorte.value['checkMasInfo']);
  }

  // Indica si se muestra el mensaje de error indicando que el tiempo de fin tiene que ser mayor que el de inicio
  mostrarErrorTiempoInicioFin(): boolean {
    const segInicio = this.obtenerSumaSegundos(this.formNuevoCorte.get('horaInicio')!.value,
      this.formNuevoCorte.get('minInicio')!.value, this.formNuevoCorte.get('segInicio')!.value);
    const segFin = this.obtenerSumaSegundos(this.formNuevoCorte.get('horaFin')!.value,
      this.formNuevoCorte.get('minFin')!.value, this.formNuevoCorte.get('segFin')!.value);

    return this.formNuevoCorte.get('horaInicio')!.touched &&
      this.formNuevoCorte.get('minInicio')!.touched &&
      this.formNuevoCorte.get('segInicio')!.touched &&
      this.formNuevoCorte.get('horaFin')!.touched &&
      this.formNuevoCorte.get('minFin')!.touched &&
      this.formNuevoCorte.get('segFin')!.touched &&
      segInicio >= segFin;
  }

  // ****** ERRORES ***** //
  // Si se indican valoraciones de la jugada, se les añade un requerido al formulario.
  datosExtraValidator() {
    return (formGroup: FormGroup) => {
      if (formGroup.value.checkMasInfo === true) {
        formGroup.get('valoracion')?.setValidators(Validators.required);
        formGroup.get('situacion')?.setValidators(Validators.required);
        formGroup.get('tipo')?.setValidators(Validators.required);
        formGroup.get('posicion')?.setValidators(Validators.required);
        formGroup.get('arbitro')?.setValidators(Validators.required);
      } else {
        formGroup.get('valoracion')?.setValidators(null);
        formGroup.get('situacion')?.setValidators(null);
        formGroup.get('tipo')?.setValidators(null);
        formGroup.get('posicion')?.setValidators(null);
        formGroup.get('arbitro')?.setValidators(null);

        formGroup.get('valoracion')?.setErrors(null);
        formGroup.get('situacion')?.setErrors(null);
        formGroup.get('tipo')?.setErrors(null);
        formGroup.get('posicion')?.setErrors(null);
        formGroup.get('arbitro')?.setErrors(null);
      }
    }
  }

  // Comprueba que el momento de inicio sea anterior al momento del fin
  validarTiemposCorte() {
    return (formGroup: FormGroup) => {
      const segInicio = this.obtenerSumaSegundos(formGroup.get('horaInicio')!.value,
        formGroup.get('minInicio')!.value, formGroup.get('segInicio')!.value);
      const segFin = this.obtenerSumaSegundos(formGroup.get('horaFin')!.value,
        formGroup.get('minFin')!.value, formGroup.get('segFin')!.value);

      if (formGroup.get('horaInicio')!.touched && formGroup.get('minInicio')!.touched &&
        formGroup.get('segInicio')!.touched && formGroup.get('horaFin')!.touched &&
        formGroup.get('minFin')!.touched && formGroup.get('segFin')!.touched) {
          if (segInicio >= segFin) {
            formGroup.get('horaFin')?.setErrors({ horaFinMenorError: true });
            formGroup.get('minFin')?.setErrors({ horaFinMenorError: true });
            formGroup.get('segFin')?.setErrors({ horaFinMenorError: true });
          } else {
            formGroup.get('horaFin')?.setErrors(null);
            formGroup.get('minFin')?.setErrors(formGroup.get('minFin')!.value > 59 ? { errorMax: true } : null);
            formGroup.get('segFin')?.setErrors(formGroup.get('segFin')!.value > 59 ? { errorMax: true } : null);
          }
        }
    }
  }

  // Dados hora, minutos y segundos, obtiene la suma de segundos
  obtenerSumaSegundos(hora: number, minuto: number, segundo: number) {
    return (((hora * 60) + minuto) * 60 + segundo);
  }

  obtenerDuracion(hIni: number, minIni: number, segIni: number, hFin: number, minFin: number, segFin: number) {
    return this.obtenerSumaSegundos(hFin, minFin, segFin) - this.obtenerSumaSegundos(hIni, minIni, segIni);
  }


  registrarNuevoCorte() {
    const segInicio = this.obtenerSumaSegundos(
      this.formNuevoCorte.get('horaInicio')!.value,
      this.formNuevoCorte.get('minInicio')!.value,
      this.formNuevoCorte.get('segInicio')!.value
    );

    const duracion = this.obtenerDuracion(
      this.formNuevoCorte.get('horaInicio')!.value,
      this.formNuevoCorte.get('minInicio')!.value,
      this.formNuevoCorte.get('segInicio')!.value,
      this.formNuevoCorte.get('horaFin')!.value,
      this.formNuevoCorte.get('minFin')!.value,
      this.formNuevoCorte.get('segFin')!.value
    )

    const hayValoracion = this.mostrarValoracionCorte();

    const nuevoCorte: DatosCorte = {
      idPartido: this.datosPartido._id!,
      segundoInicio: segInicio,
      duracion: duracion,
      comentario: hayValoracion ? this.formNuevoCorte.get('comentario')?.value : null,
      valoracion: hayValoracion ? this.formNuevoCorte.get('valoracion')?.value : null,
      situacion: hayValoracion ? this.formNuevoCorte.get('situacion')?.value : null,
      tipo: hayValoracion ? this.formNuevoCorte.get('tipo')?.value : null,
      posicion: hayValoracion ? this.formNuevoCorte.get('posicion')?.value : null,
      arbitro: hayValoracion ? this.formNuevoCorte.get('arbitro')?.value : null,
    }

    this.cortesService.guardarCorte(nuevoCorte).subscribe(
      () => {
        if (this.formNuevoCorte.get('checkOtroCorte')?.value) {
          if (this.router.url.includes('informes/realizar-informe')) {
            this.formNuevoCorte.reset({
              checkMasInfo: true
            });
          } else {
            this.formNuevoCorte.reset();
          }
          
          Object.keys(this.formNuevoCorte.controls).forEach(key => {
            this.formNuevoCorte.get(key)?.setErrors(null);
          });
          this.dialog.open(DialogConfirmarComponent,
            {restoreFocus: false, data: 'Se ha registrado el corte correctamente'})

        } else {
          if (this.router.url.includes('informes/realizar-informe')) {
            // Vuelve a la realización del informe
            this.router.navigateByUrl(`/dashboard/informes/realizar-informe`);
          
            this.dialog.open(DialogConfirmarComponent,
             {restoreFocus: false, data: 'Se ha registrado el corte correctamente'})

          } else {
            // Accede a los datos del partido
            this.interdataService.setIdPartidoToCache(this.datosPartido._id!);
            this.router.navigateByUrl(`/dashboard/partidos/partido`);
          
            this.dialog.open(DialogConfirmarComponent,
             {restoreFocus: false, data: 'Se ha registrado el corte correctamente'})
          }
        }
      },
      err => {
        console.log(err);

        this.dialog.open(DialogConfirmarComponent,
          {restoreFocus: false, data: 'Ha ocurrido un error al registrar el corte. Inténtelo de nuevo más tarde y contacte con el administrador.'})
        
      }
    );
  }


  modificarDatosCorte() {
    const segInicio = this.obtenerSumaSegundos(
      this.formNuevoCorte.get('horaInicio')!.value,
      this.formNuevoCorte.get('minInicio')!.value,
      this.formNuevoCorte.get('segInicio')!.value
    );

    const duracion = this.obtenerDuracion(
      this.formNuevoCorte.get('horaInicio')!.value,
      this.formNuevoCorte.get('minInicio')!.value,
      this.formNuevoCorte.get('segInicio')!.value,
      this.formNuevoCorte.get('horaFin')!.value,
      this.formNuevoCorte.get('minFin')!.value,
      this.formNuevoCorte.get('segFin')!.value
    )

    const hayValoracion = this.mostrarValoracionCorte();

    const corteModificado: DatosCorte = {
      _id: this.datosCorte?._id,
      __v: this.datosCorte?.__v,
      idPartido: this.datosPartido._id!,
      segundoInicio: segInicio,
      duracion: duracion,
      comentario: hayValoracion ? this.formNuevoCorte.get('comentario')?.value : null,
      valoracion: hayValoracion ? this.formNuevoCorte.get('valoracion')?.value : null,
      situacion: hayValoracion ? this.formNuevoCorte.get('situacion')?.value : null,
      tipo: hayValoracion ? this.formNuevoCorte.get('tipo')?.value : null,
      posicion: hayValoracion ? this.formNuevoCorte.get('posicion')?.value : null,
      arbitro: hayValoracion ? this.formNuevoCorte.get('arbitro')?.value : null,
    }

    this.cortesService.modificarDatosCorte(corteModificado).subscribe(
      () => {

        this.interdataService.setIdPartidoToCache(this.datosPartido._id!);
        this.router.navigateByUrl(`/dashboard/partidos/partido`);
        this.dialog.open(DialogConfirmarComponent,
          { restoreFocus: false, data: 'Se han modificado los datos del corte correctamente.' });

      },
      err => {

        console.log(err);
        this.dialog.open(DialogConfirmarComponent,
          { 
            restoreFocus: false, 
            data: 'Ha ocurrido un error al modificar los datos del corte. Inténtelo de nuevo más tarde y consulte con el administrador del sitio.' 
          });
      }
    );
  }

  clickVolver() {
    this.router.navigateByUrl('/dashboard/partidos/partido');
  }

  submit() {
    if (this.formNuevoCorte.invalid) {
      console.log(this.formNuevoCorte);
      this.formNuevoCorte.markAllAsTouched();
      return;
    }

    const dialogRef = this.datosCorte ?
      this.dialog.open(DialogModificarComponent,
        { restoreFocus: false, data: { modificado: false, mensajeDialog: '¿Desea modificar los datos del corte?' } }) :
      this.dialog.open(DialogRegistrarComponent,
        { 
          restoreFocus: false, 
          data: { registrado: false , mensajeDialog: '¿Desea registrar los datos del nuevo corte?'
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.datosCorte ? this.modificarDatosCorte() : this.registrarNuevoCorte();
      }
    });
  }

}
