import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { DatosPartido, DatosCorte, OptionItem } from '../../interfaces/data.interface';
import { DataService } from '../../services/data.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-nuevo-corte',
  templateUrl: './nuevo-corte.component.html',
  styleUrls: [ './nuevo-corte.component.css' ]
})
export class NuevoCorteComponent implements OnInit {

  datosPartido!: DatosPartido;
  datosCorte?: DatosCorte;
  urlIframe!: SafeResourceUrl;

  vValoracion: OptionItem[] = this.dataService.obtenerVValoracion();
  vSituacion: OptionItem[] = this.dataService.obtenerVSituacion();
  vTipo: OptionItem[] = this.dataService.obtenerVTipo();
  vPosicion: OptionItem[] = this.dataService.obtenerVPosicion();
  vArbitro: OptionItem[] = this.dataService.obtenerVArbitro();


  formNuevoCorte: FormGroup = this.fb.group({
    horaInicio:   [ , [ Validators.required, Validators.min(0) ] ],
    minInicio:    [ , [ Validators.required, Validators.min(0) ] ],
    segInicio:    [ , [ Validators.required, Validators.min(0), Validators.max(60) ] ],
    horaFin:   [ , [ Validators.required, Validators.min(0) ] ],
    minFin:    [ , [ Validators.required, Validators.min(0) ] ],
    segFin:    [ , [ Validators.required, Validators.min(0), Validators.max(60) ] ],
    duracion:     [ , [ Validators.required, Validators.min(5) ] ],
    checkMasInfo: [ ],
    comentario:   [ ],
    valoracion:   [ ],
    situacion:    [ ],
    tipo:         [ ],
    posicion:     [ ], 
    arbitro:      [ ]
  }, {
    validators: this.datosExtraValidator()
  })

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    // Obtenemos los datos del partido
    this.activatedRoute.params.pipe( switchMap(({ id }) => this.dataService.obtenerDatosPartido(id) ))
      .subscribe(({ partido }) => {
        this.datosPartido = partido;
        this.urlIframe = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.datosPartido.url}`);
      });
  }

  // Muestra los inputs en caso de que se quiera incluir la valoración del corte
  mostrarValoracionCorte() {
    return (this.formNuevoCorte.value['checkMasInfo']);
  }

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
      }
    }

  }

  // Dados hora, minutos y segundos, obtiene la suma de segundos
  obtenerSumaSegundos(hora: number, minuto: number, segundo: number) {
    return (((hora*60) + minuto)*60 + segundo);
  }

  obtenerDuracion(hIni: number, minIni: number, segIni: number, hFin: number, minFin: number, segFin: number) {
    return this.obtenerSumaSegundos(hFin, minFin, segFin) - this.obtenerSumaSegundos(hIni, minIni, segIni);
  }

  submit() {
    if (this.formNuevoCorte.invalid) {
      this.formNuevoCorte.markAllAsTouched();
      return;
    }



    console.log("Formulario valid:", this.formNuevoCorte.valid);
    console.log("Formulario:", this.formNuevoCorte.value);
  }

}
