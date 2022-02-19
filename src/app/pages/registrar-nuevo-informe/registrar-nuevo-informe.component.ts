import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { DatosPartido, DatosCorte, OptionItem, DatosInforme } from '../../interfaces/data.interface';
import { PartidosService } from '../../services/partidos.service';
import { AuthService } from '../../services/auth.service';
import { CortesService } from '../../services/cortes.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { ROLE_ARBITRO, ROLE_INFORMADOR } from '../../interfaces/auth.interface';
import { DialogRegistrarInformeComponent } from '../../components/dialog-registrar-informe/dialog-registrar-informe.component';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { InformesService } from '../../services/informes.service';
import { Router } from '@angular/router';
import { InterdataService } from '../../services/interdata.service';
import { ESTADO_INFORME_CREADO } from '../../interfaces/constantes.interface';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-registrar-nuevo-informe',
  templateUrl: './registrar-nuevo-informe.component.html',
  styleUrls: ['./registrar-nuevo-informe.component.css']
})
export class RegistrarNuevoInformeComponent implements OnInit {

  datosInforme: DatosInforme = {};
  nombreArbitroPrincipal: string = '';
  nombreArbitroAuxiliar: string = '';
  nombreInformador: string = '';

  listadoPartidos: DatosPartido[] = [];
  listadoCortes: DatosCorte[] = [];
  listadoUsuarios: Usuario[] = [];

  cargandoDatosPartido: boolean = false;
  cargandoPartidos: boolean = false;
  cargandoCortes: boolean = true;
  cargandoUsuarios: boolean = false;

  modificando: boolean = false;

  partidoInformado?: DatosPartido;
  eventPartidoSeleccionado: Subject<DatosPartido> = new Subject<DatosPartido>();

  formArbitros: FormGroup = this.fb.group({
    arbitroPrincipal:   [ , [ Validators.required ] ],
    arbitroAuxiliar:    [ , [ Validators.required ] ],
  });

  formInformador: FormGroup = this.fb.group({
    informador:   [ , [ Validators.required ] ],
  })

  vSelectArbitros: OptionItem[] = [];
  vSelectInformadores: OptionItem[] = [];


  constructor(
    private partidosService: PartidosService,
    private authService: AuthService,
    private cortesService: CortesService,
    private informesService: InformesService,
    private interdataService: InterdataService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {

    const idInforme = this.interdataService.getIdInformeFromCache();
    if (idInforme) {
      this.modificando = true;
      this.cargandoPartidos = true;
      this.cargandoUsuarios = true;

      this.informesService.obtenerInforme(idInforme).pipe(
        switchMap( informe => this.asignarDatosInformeYBuscarDatosPartido(informe)),
        switchMap( listadoPartidos => this.asignarListadoPartidosYObtenerUsuarios(listadoPartidos))
      ).subscribe( listadoUsuarios => {
        this.listadoUsuarios = listadoUsuarios;

        this.rellenarDatosSelectsUsuarios();
        this.listadoUsuarios.forEach( usuario => {
          if (usuario._id === this.datosInforme.arbitroPrincipal) {
            this.datosInforme.datosArbitroPrincipal = usuario;
          } else if (usuario._id === this.datosInforme.arbitroAuxiliar) {
            this.datosInforme.datosArbitroAuxiliar = usuario;
          } else if (usuario._id === this.datosInforme.informador) {
            this.datosInforme.datosInformador = usuario;
          }
        })

        this.nombreArbitroPrincipal = `${this.datosInforme.datosArbitroPrincipal!.nombre} ${this.datosInforme.datosArbitroPrincipal!.apellidos}`;
        this.nombreArbitroAuxiliar = `${this.datosInforme.datosArbitroAuxiliar!.nombre} ${this.datosInforme.datosArbitroAuxiliar!.apellidos}`;
        this.nombreInformador = `${this.datosInforme.datosInformador!.nombre} ${this.datosInforme.datosInformador!.apellidos}`;

        this.formArbitros.reset({
          arbitroPrincipal: this.datosInforme.datosArbitroPrincipal!.nif,
          arbitroAuxiliar: this.datosInforme.datosArbitroAuxiliar!.nif
        });

        this.formInformador.reset({
          informador: this.datosInforme.datosInformador!.nif,
        });

        this.cargandoPartidos = false;
        this.cargandoUsuarios = false;
      })
    } else {
      this.obtenerListadoPartidos();
      this.obtenerUsuarios();
    }
  }

  asignarDatosInformeYBuscarDatosPartido(informe: DatosInforme) {
    this.datosInforme = informe;
    return this.partidosService.obtenerListadoPartidos();
  }

  asignarListadoPartidosYObtenerUsuarios(listadoPartidos: DatosPartido[]) {
    this.listadoPartidos = listadoPartidos;
    var i = 0;

    this.listadoPartidos.forEach( partido => {
      if (partido._id === this.datosInforme.idPartido) {
        this.datosInforme.datosPartido = partido;
        this.partidoInformado = partido;
      } else {
        i++;
      }
    })
    return this.authService.herokuGetUserListProtected();
  }

  obtenerListadoPartidos() {
    this.cargandoPartidos = true;

    this.partidosService.obtenerListadoPartidos()
      .subscribe(listadoPartidosResp => {
        this.listadoPartidos = listadoPartidosResp;
        this.cargandoPartidos = false;
      })
  }

  obtenerUsuarios() {
    this.cargandoUsuarios = true;
    this.authService.herokuGetUserListProtected()
      .subscribe( listadoUsuariosResp => {
        this.listadoUsuarios = listadoUsuariosResp;
        this.rellenarDatosSelectsUsuarios();
      })
  }

  rellenarDatosSelectsUsuarios() {
    this.listadoUsuarios.forEach( usuario => {
      // Array de árbitros
      if (usuario.role?.includes(ROLE_ARBITRO)) {
        this.vSelectArbitros.push({
          texto: `${usuario.nombre} ${usuario.apellidos}`,
          value: usuario.nif
        })
        
      }
      // Array de informadores
      if (usuario.role?.includes(ROLE_INFORMADOR)) {
        this.vSelectInformadores.push({
          texto: `${usuario.nombre} ${usuario.apellidos}`,
          value: usuario.nif
        })
      }

      this.vSelectArbitros.sort( (a, b) => {
        return a.texto.toLocaleLowerCase() > b.texto.toLocaleLowerCase() ? 1 : -1;
      })
      this.vSelectInformadores.sort( (a, b) => {
        return a.texto.toLocaleLowerCase() > b.texto.toLocaleLowerCase() ? 1 : -1;
      })
    
    })
  }

  buscarIdUsuario(nif: string): string {
    var id: string = '';
    this.listadoUsuarios.forEach( usuario => {
      if (usuario.nif === nif){
        id = usuario._id!;
      }
    })
    return id;
  }

  /***************************************************/
  /**********        PASO 1              *************/
  /***************************************************/
  cargandoDatosVista(): boolean {
    return this.cargandoUsuarios || this.cargandoUsuarios;
  }

  deseleccionarPartidoInformado() {
    this.partidoInformado = undefined;
    this.datosInforme.idPartido = undefined;
  }

  escucharPartidoSeleccionado(partido: DatosPartido) {
    this.partidoInformado = partido;
    this.datosInforme!.idPartido = this.partidoInformado._id!;
    this.cargandoCortes = true;

    this.cortesService.obtenerCortesDelPartido(this.partidoInformado!._id!)
      .subscribe( listadoCortesResp => {
        this.listadoCortes = listadoCortesResp;
        this.cargandoCortes = false;
      });
  }

  /***************************************************/
  /**********        PASO 2              *************/
  /***************************************************/
  asignarArbitroPrincipal(value: string) {
    this.datosInforme.arbitroPrincipal = this.buscarIdUsuario(value);
    this.vSelectArbitros.forEach( item => {
      if (item.value === value) {
        this.nombreArbitroPrincipal = item.texto;
      }
    })
  }

  asignarArbitroAuxiliar(value: string) {
    this.datosInforme.arbitroAuxiliar = this.buscarIdUsuario(value);
    this.vSelectArbitros.forEach( item => {
      if (item.value === value) {
        this.nombreArbitroAuxiliar = item.texto;
      }
    })
  }

  habilitarPasoTres(): boolean {
    return this.formArbitros.valid &&
      (this.datosInforme.arbitroPrincipal !== this.datosInforme.arbitroAuxiliar);
  }

  /***************************************************/
  /**********        PASO 3              *************/
  /***************************************************/
  asignarInformador(value: string) {
    this.datosInforme.informador = this.buscarIdUsuario(value);
    this.vSelectInformadores.forEach( item => {
      if (item.value === value) {
        this.nombreInformador = item.texto;
      }
    })
  }

  habilitarResumen(): boolean {
    return this.formInformador.valid &&
      (this.datosInforme.informador !== this.datosInforme.arbitroPrincipal) &&
      (this.datosInforme.informador !== this.datosInforme.arbitroAuxiliar);
  }

  /***************************************************/
  /**********        RESUMEN             *************/
  /***************************************************/
  registrarInforme() {
    const dialogRef = this.dialog.open(DialogRegistrarInformeComponent,
      {
        restoreFocus: false,
        data: { registrarCortes: false, modificar: this.modificando }
      });

    dialogRef.afterClosed().subscribe(result => {

      if (result === true || result === false) {

        // Asignamos el estado CREADO al informe
        this.datosInforme.estado = ESTADO_INFORME_CREADO;
        
        const obsInforme = this.modificando ?
          this.informesService.modificarInforme(this.datosInforme) :
          this.informesService.guardarInforme(this.datosInforme);

        obsInforme.subscribe(
          informeResp => {
            this.dialog.open(DialogConfirmarComponent,
              {
                restoreFocus: false,
                data: this.modificando ? 
                  'El registro del informe se ha modificado correctamente' : 
                  'El informe se ha registrado correctamente.'
              })
            
            if (result === true) {
              this.interdataService.setIdInformeToCache(informeResp._id);
            }

            this.router.navigateByUrl( result === true ? '/dashboard/informes/realizar-informe' : 
              '/dashboard/informes');
          },
          err => {
            console.log(err);
            this.dialog.open(DialogConfirmarComponent,
              {
                restoreFocus: false,
                data: `Ha ocurrido un error al ${this.modificando ? 'modificar' : 'registrar'} el informe. Consulte con el administrador e inténtelo de nuevo más tarde.`
              })
          }
        )
      }
    })
  }

  modificarInforme() {

  }
}
