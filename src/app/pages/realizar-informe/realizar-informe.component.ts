import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { DatosInforme, DatosCorte, DatosPartido, LSCortesInforme } from '../../interfaces/data.interface';
import { InterdataService } from '../../services/interdata.service';
import { InformesService } from '../../services/informes.service';
import { switchMap } from 'rxjs/operators';
import { CortesService } from '../../services/cortes.service';
import { PartidosService } from '../../services/partidos.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogRegistrarComponent } from '../../components/dialog-registrar/dialog-registrar.component';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { ESTADO_INFORME_BORRADOR, ESTADO_INFORME_TERMINADO } from '../../interfaces/constantes.interface';

@Component({
  selector: 'app-realizar-informe',
  templateUrl: './realizar-informe.component.html',
  styleUrls: ['./realizar-informe.component.css']
})
export class RealizarInformeComponent implements OnInit, OnDestroy {

  // PASO 1: SELECCIÓN DE LOS CORTES
  cargandoCortes: boolean = false;
  datosInforme!: DatosInforme;

  listadoCortesPartido: DatosCorte[] = [];
  listadoCortesSeleccionados: DatosCorte[] = [];

  eventsSubject: Subject<DatosCorte> = new Subject<DatosCorte>();

  // PASO 2: COMENTARIOS SOBRE LOS ÁRBITROS
  formComentarios: FormGroup = this.fb.group({
    comentarioArbitroPrincipal:   [ , [Validators.required ] ],
    comentarioArbitroAuxiliar:    [ , [Validators.required ] ],
    comentarioGeneral:            [ , [Validators.required ] ],
    
  })

  // PASO 3: NOTAS SOBRE LOS ÁRBITROS
  formNotas: FormGroup = this.fb.group({
    notaArbitroPrincipal:   [ , [ Validators.required ] ],
    notaArbitroAuxiliar:    [ , [ Validators.required ] ],
  })

  vNotasPosibles = Array.from(Array(11).keys());

  constructor(
    private interdataService: InterdataService,
    private informesService: InformesService,
    private partidosService: PartidosService,
    private cortesService: CortesService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.cargandoCortes = true;
    const idInforme = this.interdataService.getIdInformeFromCache();
    const cortesInforme: LSCortesInforme = this.interdataService.getCortesInformeFromCache();

    if (idInforme || cortesInforme) {
      this.obtenerDatosCompletosDelInforme(idInforme!, cortesInforme);
    } else {
      this.router.navigateByUrl('/dashboard/informes');
    }
  }

  ngOnDestroy(): void {
    this.datosInforme.estado = ESTADO_INFORME_BORRADOR;
    this.datosInforme.comentarioArbitroPrincipal = this.formComentarios.get('comentarioArbitroPrincipal')?.value;
    this.datosInforme.comentarioArbitroAuxiliar = this.formComentarios.get('comentarioArbitroAuxiliar')?.value;
    this.datosInforme.comentarioGeneral = this.formComentarios.get('comentarioGeneral')?.value;
    this.datosInforme.notaArbitroPrincipal = this.formNotas.get('notaArbitroPrincipal')?.value;
    this.datosInforme.notaArbitroAuxiliar = this.formNotas.get('notaArbitroAuxiliar')?.value;

    this.informesService.modificarInforme(this.datosInforme)
    .subscribe(() => {}, err => console.log(err));
  }

  obtenerDatosCompletosDelInforme(idInforme: string | undefined, cortesInforme?: LSCortesInforme) {
    if (cortesInforme) {
      idInforme = cortesInforme.idInforme;
    } 

    this.informesService.obtenerInforme(idInforme!).pipe(
      switchMap( informeResp => this.asignarInformeYBuscarDatosPartido(informeResp)),
      switchMap( ({partido}) => this.asignarDatosPartidosYBuscarCortes(partido))
    ).subscribe( listadoCortesResp => {
      
      this.listadoCortesPartido = this.filtrarListadoCortesConValoracion(listadoCortesResp);

      if (cortesInforme !== undefined) {
        this.datosInforme.cortesIds = cortesInforme.cortesIds;
      }

      if (cortesInforme || 
        this.datosInforme.estado === ESTADO_INFORME_BORRADOR || 
        this.datosInforme.estado === ESTADO_INFORME_TERMINADO) {
        this.listadoCortesPartido.forEach( corte => {
          if (cortesInforme?.cortesIds.includes(corte._id!) ||
            this.datosInforme.cortesIds?.includes(corte._id!)) {
            corte.checked = true;
          }
        })
      }

      if (this.datosInforme.estado === ESTADO_INFORME_BORRADOR || this.datosInforme.estado === ESTADO_INFORME_TERMINADO) {

        this.formComentarios.reset({
          comentarioArbitroPrincipal: this.datosInforme.comentarioArbitroPrincipal,
          comentarioArbitroAuxiliar: this.datosInforme.comentarioArbitroAuxiliar,
          comentarioGeneral: this.datosInforme.comentarioGeneral,
        })

        this.formNotas.reset({
          notaArbitroPrincipal: this.datosInforme.notaArbitroPrincipal,
          notaArbitroAuxiliar: this.datosInforme.notaArbitroAuxiliar,
        })

      }

      this.cargandoCortes = false;
    })
  }

  // Filtra el listado de cortes para obtener solamente los que han sido valorados
  filtrarListadoCortesConValoracion(listadoCortes: DatosCorte[]): DatosCorte[] {
    var listadoFiltrado: DatosCorte[] = [];

    listadoCortes.forEach( corte => {
      if (corte.valoracion) {
        corte.datosPartido = this.datosInforme.datosPartido;
        listadoFiltrado.push(corte);
      }
    })

    return listadoFiltrado;
  }

  mensajeCortesSeleccionados(): string {
    if (this.datosInforme.cortesIds!.length === 0) {
      return 'No se ha seleccionado ningún corte todavía';
    } else if (this.datosInforme.cortesIds!.length === 1) {
      return 'Se ha seleccionado 1 corte para el informe';
    } else {
      return `Se han seleccionado ${this.datosInforme.cortesIds!.length} cortes para el informe`;
    }
  }

  // ***** OBSERVABLES PARA ASIGNAR DATOS ***** //
  asignarInformeYBuscarDatosPartido(informe: DatosInforme) {
    this.datosInforme = informe;
    return this.partidosService.obtenerDatosPartido(informe.idPartido!);
  }

  asignarDatosPartidosYBuscarCortes(partido: DatosPartido) {
    this.datosInforme.datosPartido = partido;
    return this.cortesService.obtenerCortesDelPartido(partido._id!);
  }

  // Escucha el corte que se emite desde el buscador de cortes para insertarlo/eliminarlo en la lista
  escucharCorteEmitido(corte: DatosCorte) {
    if (corte.checked) {  
      this.datosInforme.cortesIds?.push(corte._id!);
    } else {
      this.datosInforme.cortesIds?.splice(this.datosInforme.cortesIds?.indexOf(corte._id!), 1);
    }
  }

  // Va a la página de registrar cortes, guardando el estado actual de la ventana
  registrarNuevosCortes() {
    this.datosInforme.estado = ESTADO_INFORME_BORRADOR;
    this.datosInforme.comentarioArbitroPrincipal = this.formComentarios.get('comentarioArbitroPrincipal')?.value;
    this.datosInforme.comentarioArbitroAuxiliar = this.formComentarios.get('comentarioArbitroAuxiliar')?.value;
    this.datosInforme.comentarioGeneral = this.formComentarios.get('comentarioGeneral')?.value;
    this.datosInforme.notaArbitroPrincipal = this.formNotas.get('notaArbitroPrincipal')?.value;
    this.datosInforme.notaArbitroAuxiliar = this.formNotas.get('notaArbitroAuxiliar')?.value;

    this.informesService.modificarInforme(this.datosInforme).subscribe(
      () => {
        this.interdataService.setIdPartidoToCache(this.datosInforme.datosPartido!._id!);
        this.router.navigateByUrl('dashboard/informes/realizar-informe/nuevo-corte');
      },
      err => {
        console.log(err);
        this.dialog.open( DialogConfirmarComponent ,
          {
            restoreFocus: false,
            data: 'Ha ocurrido un error al guardar el borrador. Inténtelo de nuevo más tarde. Contacte con el administrador del sitio.'
          })
      })
  }

  terminarInforme() {
    if (this.formComentarios.invalid || this.formNotas.invalid || this.datosInforme.cortesIds!.length === 0) {
      this.formComentarios.markAllAsTouched();
      this.formComentarios.markAllAsTouched();

      this.dialog.open( DialogConfirmarComponent,
        { restoreFocus: false, data: 'Ha ocurrido un error. Debe rellenar todos los datos solicitados para poder registrar el informe correctamente.'})
    }
    const dialogRef = this.dialog.open(DialogRegistrarComponent,
      {
        restoreFocus: false,
        data: { registrado: false , mensajeDialog: '¿Quieres terminar el informe y registrarlo?'}
      });

    dialogRef.afterClosed().subscribe( 
      result => {
        if (result) {

          // Asignamos el estado TERMINADO al informe
          this.datosInforme.estado = ESTADO_INFORME_TERMINADO;

          this.datosInforme.comentarioArbitroPrincipal = this.formComentarios.get('comentarioArbitroPrincipal')?.value;
          this.datosInforme.comentarioArbitroAuxiliar = this.formComentarios.get('comentarioArbitroAuxiliar')?.value;
          this.datosInforme.comentarioGeneral = this.formComentarios.get('comentarioGeneral')?.value;
          this.datosInforme.notaArbitroPrincipal = this.formNotas.get('notaArbitroPrincipal')?.value;
          this.datosInforme.notaArbitroAuxiliar = this.formNotas.get('notaArbitroAuxiliar')?.value;

          this.informesService.modificarInforme(this.datosInforme).subscribe(
            resp => {
              this.interdataService.setIdInformeToCache(this.datosInforme._id!);


              this.interdataService.removeCortesInformeFromCache();
              this.router.navigateByUrl('/dashboard/informes/ver-informe');
              this.dialog.open( DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'El informe se ha registrado correctamente.'
                }
              )
            }, err => {
              console.log(err);

              this.interdataService.removeCortesInformeFromCache();
              this.router.navigateByUrl('/dashboard/informes');
              
              this.dialog.open( DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'Ha ocurrido un error al registrar el informe. Consulte con el administrador del sitio e inténtelo de nuevo más tarde.'
                }
              )
            }
          )          
        }
      }
    )
  }

  pulsarBotonGuardarBorrador() {
    const dialogRef = this.dialog.open( DialogRegistrarComponent,
      {
        restoreFocus: false,
        data: { 
          registrado: false, 
          mensajeDialog: '¿Quieres guardar el borrador del informe y continuar más tarde?'
        }
      })

    dialogRef.afterClosed().subscribe(
      resp => {
        // Se guarda el borrador del informe
        if (resp) {
          this.datosInforme.estado = ESTADO_INFORME_BORRADOR;
          this.datosInforme.comentarioArbitroPrincipal = this.formComentarios.get('comentarioArbitroPrincipal')?.value;
          this.datosInforme.comentarioArbitroAuxiliar = this.formComentarios.get('comentarioArbitroAuxiliar')?.value;
          this.datosInforme.comentarioGeneral = this.formComentarios.get('comentarioGeneral')?.value;
          this.datosInforme.notaArbitroPrincipal = this.formNotas.get('notaArbitroPrincipal')?.value;
          this.datosInforme.notaArbitroAuxiliar = this.formNotas.get('notaArbitroAuxiliar')?.value;

          this.informesService.modificarInforme(this.datosInforme).subscribe(
            () => {

              this.interdataService.removeCortesInformeFromCache();
              this.router.navigateByUrl('/dashboard/informes');

              this.dialog.open( DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'Se ha guardado el borrador correctamente.'
                });
            },
            err => {
              console.log(err);

              this.dialog.open( DialogConfirmarComponent ,
                {
                  restoreFocus: false,
                  data: 'Ha ocurrido un error al guardar el borrador. Inténtelo de nuevo más tarde. Contacte con el administrador del sitio.'
                })
            }
          )
        }
      }
    )
  }

  

}
