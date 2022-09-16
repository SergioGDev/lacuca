import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

import { DatosCorte, DatosVideotest, DatosPreguntaVideotest } from '../../interfaces/data.interface';
import { DialogVerCorteComponent } from '../../components/dialog-ver-corte/dialog-ver-corte.component';
import { DialogRegistrarComponent } from '../../components/dialog-registrar/dialog-registrar.component';
import { VideotestService } from '../../services/videotest.service';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { Router } from '@angular/router';
import { InterdataService } from '../../services/interdata.service';
import { CortesService } from '../../services/cortes.service';
import { switchMap } from 'rxjs/operators';
import { DialogModificarComponent } from '../../components/dialog-modificar/dialog-modificar.component';

@Component({
  selector: 'app-registrar-nuevo-videotest',
  templateUrl: './registrar-nuevo-videotest.component.html',
  styleUrls: ['./registrar-nuevo-videotest.component.css']
})
export class RegistrarNuevoVideotestComponent implements OnInit {

  editandoVideotest: boolean = false;
  cargandoDatos: boolean = false;

  listadoCortesSeleccionados: DatosCorte[] = [];
  listadoCompletoCortes: DatosCorte[] = [];
  listadoCompletoCortesChecked: DatosCorte[] = [];
  preguntasVideotest: DatosVideotest = { preguntas: [] };

  eventsSubject: Subject<DatosCorte> = new Subject<DatosCorte>();

  // Datos tabla
  dataSource: any;
  displayedColums = ['valoracion', 'situacion', 'tipo', 'posicion', 'equipoLocal', 'equipoVisitante', 'eliminar'];
  resultsLength: number = 0;

  // Formulario del videotest
  formularioVideotest: FormGroup = this.fb.group({
    nombreVideotest: [, [Validators.required]],
    descripcionVideotest: [],
  })

  textoPregunta: string = 'texto-pregunta';
  addRespuesta: string = 'add-respuesta';
  textoSolucion: string = 'texto-solucion';

  mensajeErrorExcesoPreguntas: boolean[] = [];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private videotestService: VideotestService,
    private cortesService: CortesService,
    private interdataService: InterdataService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    const idVideotest = this.interdataService.getIdVideotestFromCache();

    if (idVideotest) {
      this.editandoVideotest = true;
      this.obtenerListadoCortesYDatosVideotest(idVideotest);
    } else {
      this.obtenerListadoCompletoCortes();
    }

  }

  /**********************************************************/
  /***********     MÉTODOS GENERALES              ***********/
  /**********************************************************/
  obtenerListadoCompletoCortes() {
    this.cargandoDatos = true;
    this.cortesService.obtenerListadoCompletoCortesConDatosPartidos()
      .subscribe(listadoCortesResp => {
        this.listadoCompletoCortes = listadoCortesResp;
        this.listadoCompletoCortesChecked = listadoCortesResp;
        this.cargandoDatos = false;
        this.asignarDataSource();
      });
  }

  obtenerListadoCortesYDatosVideotest(idVideotest: string) {
    this.cargandoDatos = true;

    this.cortesService.obtenerListadoCompletoCortesConDatosPartidos().pipe(
      switchMap(listadoCortesResp => {
        this.listadoCompletoCortes = listadoCortesResp;
        // this.listadoCompletoCortesChecked = listadoCortesResp;
        this.asignarDataSource();
        return this.videotestService.obtenerDatosCompletosVideotest(idVideotest);
      })
    ).subscribe(videotestResp => {
      this.preguntasVideotest = videotestResp;

      this.preguntasVideotest.preguntas?.forEach(pregunta => {
        this.listadoCortesSeleccionados.push(pregunta.corte!);
        const index = this.listadoCompletoCortes.findIndex( corte => corte._id === pregunta.idCorte );
        this.listadoCompletoCortes[index].checked = true;
      })

      this.listadoCompletoCortesChecked = this.listadoCompletoCortes;

      this.crearFormularioVideotest();
      this.asignarDataSource();
      this.cargandoDatos = false;
    })
  }

  // Asigna a la vista el dataSource existente para que se muestre en la tabla
  asignarDataSource() {
    this.dataSource = new MatTableDataSource<DatosCorte>(this.listadoCortesSeleccionados);
    this.dataSource.data = this.listadoCortesSeleccionados;
    this.dataSource.paginator = this.paginator;
    this.resultsLength = this.listadoCortesSeleccionados.length;
  }

  // Escucha el corte que se emite desde el buscador de cortes para insertarlo/eliminarlo en la lista
  escucharCorteEmitido(corte: DatosCorte) {
    if (corte.checked) {
      this.listadoCortesSeleccionados.push(corte);
      this.preguntasVideotest!.preguntas?.push({
        pregunta: '',
        respuestas: [],
        solucion: '',
        idCorte: corte._id!,
        corte: corte,
      });

      this.crearFormularioVideotest();
    } else {
      this.eliminarCorteDeLaLista(corte);
    }
    this.asignarDataSource();
  }

  crearFormularioVideotest() {
    this.formularioVideotest = this.fb.group({
      nombreVideotest: [ this.preguntasVideotest.nombre ? this.preguntasVideotest.nombre : '', [Validators.required]],
      descripcionVideotest: [ this.preguntasVideotest.descripcion ? this.preguntasVideotest.descripcion : '' ],
    })

    if (this.preguntasVideotest?.preguntas) {
      for (var i = 0; i < this.preguntasVideotest!.preguntas!.length; i++) {
        this.formularioVideotest.addControl(
          `${this.textoPregunta}-${i}`, 
          new FormControl(this.preguntasVideotest.preguntas[i].pregunta ? 
            this.preguntasVideotest.preguntas[i].pregunta : '', 
            Validators.required)
        );
        this.formularioVideotest.addControl(
          `${this.addRespuesta}-${i}`, 
          new FormControl('')
        );
        this.formularioVideotest.addControl(
          `${this.textoSolucion}-${i}`,
          new FormControl(this.preguntasVideotest.preguntas[i].solucion ? 
            this.preguntasVideotest.preguntas[i].solucion : '', 
            Validators.required)
        );
      }
    }
  }

  preventDefault(event: any) {
    event.preventDefault();
  }

  /************************************************/
  /***********     PASO 1               ***********/
  /************************************************/

  // Elimina el corte seleccionado de la lista
  eliminarCorteDeLaLista(datosCorte: DatosCorte) {
    const index = this.listadoCortesSeleccionados.indexOf(datosCorte);
    if (index > -1) {
      this.listadoCortesSeleccionados.splice(index, 1);
      this.preguntasVideotest?.preguntas?.splice(index, 1);
    }
    this.asignarDataSource();
    this.eventEnviarCorteEliminado(datosCorte);
  }

  // Envía al componente "BuscadorCortes" el corte que debe desmarcar de la lista
  eventEnviarCorteEliminado(datosCorte: DatosCorte) {
    this.eventsSubject.next(datosCorte);
  }

  // Abre un dialog para mostrar el corte
  verCorteEnDialog(corte: DatosCorte) {
    this.dialog.open(DialogVerCorteComponent, { data: { datosCorte: corte } });
  }

  /*************************************************/
  /***********     PASO 2                ***********/
  /*************************************************/
  enterAddInput(event: any, pos: number) {
    this.preventDefault(event);

    if (this.preguntasVideotest.preguntas![pos].respuestas.length < 4) {
      this.preguntasVideotest.preguntas![pos].respuestas.push(
        this.formularioVideotest.get(this.getFormControlName(this.addRespuesta, pos))!.value
      );
      this.formularioVideotest.get(this.getFormControlName(this.addRespuesta, pos))!.setValue('');
      this.mensajeErrorExcesoPreguntas[pos] = false;
    } else {
      this.mensajeErrorExcesoPreguntas[pos] = true;
    }
  }

  eliminarRespuesta(i: number, j: number) {
    this.preguntasVideotest.preguntas![i].respuestas.splice(j, 1);
    this.formularioVideotest.get(this.getFormControlName(this.textoSolucion, i))!.setValue('');
    this.preguntasVideotest.preguntas![i].solucion = '';
    this.mensajeErrorExcesoPreguntas[i] = false;
  }

  submitIrAlResumen() {

    if (this.formularioVideotest.invalid) {
      this.formularioVideotest.markAllAsTouched();
    }

    this.preguntasVideotest.nombre = this.formularioVideotest.get('nombreVideotest')?.value;
    this.preguntasVideotest.descripcion = this.formularioVideotest.get('descripcionVideotest')?.value;

    for (var i = 0; i < this.preguntasVideotest.preguntas!.length; i++) {
      // Asignamos el texto de las preguntas y la solución del formulario al objeto
      this.preguntasVideotest.preguntas![i].pregunta = this.formularioVideotest.get(this.getFormControlName(this.textoPregunta, i))?.value;
      this.preguntasVideotest.preguntas![i].solucion = this.formularioVideotest.get(this.getFormControlName(this.textoSolucion, i))?.value;
    }

  }

  // El paso dos estará completo cuando todas las preguntas tengan almenos dos respuestas asignadas y el formulario sea válido
  pasoDosCompletado(): boolean {
    var todasTienenDosRespuestas = true;

    this.preguntasVideotest.preguntas?.forEach(pregunta => {
      if (pregunta.respuestas.length < 2) {
        todasTienenDosRespuestas = false;
      }
    })

    return this.formularioVideotest.valid && todasTienenDosRespuestas;
  }


  /*************************************************/
  /***********     PASO 3                ***********/
  /*************************************************/
  guardarVideotest() {

    if (this.formularioVideotest.invalid) {
      this.formularioVideotest.markAllAsTouched();
      return;
    }

    // Diálogo de confirmación
    const dialogRef = this.editandoVideotest ?
      this.dialog.open( DialogModificarComponent,
      {
        restoreFocus: false,
        data: { registrado: false, mensajeDialog: `¿Quieres editar el videotes "${this.preguntasVideotest.nombre}" con los datos indicados?` }
      }) :
      this.dialog.open( DialogRegistrarComponent,
      {
        restoreFocus: false,
        data: { registrado: false, mensajeDialog: '¿Registrar el videotest con los datos indicados?' }
      });

    // Cuando aceptes realizar la acción, creas un nuevo registro o editas uno existente  
    dialogRef.afterClosed().subscribe(
      registrado => {
        if (registrado) {
          var registroVideotest: DatosVideotest = {
            _id: this.preguntasVideotest._id,
            nombre: this.preguntasVideotest.nombre,
            descripcion: this.preguntasVideotest.descripcion,
            preguntas: []
          }

          this.preguntasVideotest.preguntas?.forEach(pregunta => {
            registroVideotest.preguntas?.push({
              pregunta: pregunta.pregunta,
              solucion: pregunta.solucion,
              idCorte: pregunta.idCorte,
              respuestas: pregunta.respuestas
            })
          })

          const obsService = this.editandoVideotest ?
            this.videotestService.modificarVideotest(registroVideotest) :
            this.videotestService.registrarVideotest(registroVideotest);

          obsService.subscribe(
            () => {
              this.router.navigateByUrl('/dashboard/zona-tests/admin-videotest');
              this.dialog.open(DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: this.editandoVideotest ? 'El videotest se ha editado correctamente' : 'El videotest se ha registrado correctamente.'
                })
            },
            err => {
              console.log(err);
              this.dialog.open(DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: this.editandoVideotest ?
                    'Ha ocurrido un error al editar el videotest. Inténtelo de nuevo más tarde. Contacte con el administrador del sitio.' :
                    'Ha ocurrido un error al registrar el videotest. Inténtelo de nuevo más tarde. Contacte con el administrador del sitio.'
                })
            }
          )
        }
      }
    )
  }


  // ************************************************** //
  // *******    TRATAMIENTO DATOS FORMULARIO    ******* //
  // ************************************************** //
  getFormControlName(texto: string, numeroCorte: number) {
    return `${texto}-${numeroCorte}`;
  }

  // ************************************************** //
  // ********      FUNCIONES DE TAMAÑO          ******* //
  // ************************************************** //
  getFxFlexVideo(corte: DatosCorte) {
    return (corte.valoracion ? 60 : 100);
  }

  getYoutubePlayerWidth() {
    return window.innerWidth > 500 ? 500 : window.innerWidth;
  }


}
