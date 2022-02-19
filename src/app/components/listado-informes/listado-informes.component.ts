import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { DatosInforme, DatosPartido } from '../../interfaces/data.interface';
import { OperationsService } from '../../services/operations.service';
import { InterdataService } from '../../services/interdata.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { ESTADO_INFORME_CREADO, ESTADO_INFORME_BORRADOR, ESTADO_INFORME_TERMINADO } from '../../interfaces/constantes.interface';
import { DialogEliminarComponent } from '../dialog-eliminar/dialog-eliminar.component';
import { InformesService } from '../../services/informes.service';
import { DialogConfirmarComponent } from '../dialog-confirmar/dialog-confirmar.component';

@Component({
  selector: 'app-listado-informes',
  templateUrl: './listado-informes.component.html',
  styleUrls: ['./listado-informes.component.css']
})
export class ListadoInformesComponent implements OnInit {

  @Input() listadoInformes!: DatosInforme[];
  // Variables para la tabla y el paginador
  dataSource: any;
  displayedColumns: string[] = ['partido', 'fecha', 'informador', 'arbitros', 'estado', 'acciones'];
  resultLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() msgNoHayInformes!: string;

  constructor(
    private operationsService: OperationsService,
    private informesService: InformesService,
    private interdataService: InterdataService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.asignarDataSource();
    this.ordenarTablaListadoInformes({active: 'fecha', direction: 'desc'});
  }


  asignarDataSource() {
    this.dataSource = new MatTableDataSource<DatosInforme>(this.listadoInformes);
    this.dataSource.data = this.listadoInformes;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.resultLength = this.listadoInformes.length;
  }

  // ACCIONES SOBRE LOS INFORMES
  // Accede a la ventana de realización de un informe
  realizarInforme(idInforme: string) {
    this.interdataService.setIdInformeToCache(idInforme);
    this.router.navigateByUrl('/dashboard/informes/realizar-informe');
  }

  // Accede a la ventana para modificar el registro de un informe
  modificarRegistroDeInforme(idInforme: string) {
    this.interdataService.setIdInformeToCache(idInforme);
    this.router.navigateByUrl('/dashboard/informes/modificar-informe');
  }

  // Muestra un dialogo para eliminar el informe. En caso afirmativo, lo elimina
  eliminarInforme(idInforme: string) {
    const dialogRef = this.dialog.open( DialogEliminarComponent, 
      {
        restoreFocus: false,
        data: {eliminado: false, mensajeDialog: '¿Desea eliminar el registro de este informe?'}
      })
    
      dialogRef.afterClosed().subscribe( eliminar => {
        if (eliminar) {
          this.informesService.eliminarInforme(idInforme).subscribe(
            () => {

              var indexOf = this.listadoInformes.length + 1;
              this.listadoInformes.forEach( informe => {
                if (informe._id === idInforme) {
                  indexOf = this.listadoInformes.indexOf(informe);
                }
              })

              this.listadoInformes.splice(indexOf, 1);
              this.asignarDataSource();

              this.dialog.open(DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'El registro del informe se ha eliminado correctamente.'
                })

            },
            err => {
              console.log(err);
              this.router.navigateByUrl('/dashboard/informes');

              this.dialog.open(DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'Ha ocurrido un error al eliminar el registro del informe. Inténtelo de nuevo más tarde. Contacte con el administrador del sitio.'
                })

            }
          )
        }
      })
  }

  modificarInforme(idInforme: string) {
    this.interdataService.setIdInformeToCache(idInforme);
    this.router.navigateByUrl('/dashboard/informes/realizar-informe');
  }

  verDatosInforme(idInforme: string) {
    this.interdataService.setIdInformeToCache(idInforme);
    this.router.navigateByUrl('/dashboard/informes/ver-informe');
  }

  descargarInformeEnPDF() {
    // TODO: Implementar la lógica para descargar el informe en formato PDF
    this.dialog.open( DialogConfirmarComponent,
      {
        restoreFocus: false,
        data: 'Esta función todavía no está disponible.'
      })
  }

  // Obtiene el nombre completo del usuario
  obtenerNombreCompletoUsuario(usuario: Usuario): string {
    return this.operationsService.nombreCompletoUsuario(usuario);
  }

  obtenerFilaPartido(datosPartido: DatosPartido): string {
    return datosPartido.equipoLocal + '\n' + datosPartido.equipoVisitante;
  }

  ordenarTablaListadoInformes(sort: any) {
    const data = this.listadoInformes.slice();
    if (!sort.active || sort.direction == '') {
      this.listadoInformes = data;
      return;
    }

    var aux;
    for (var i = 1; i < data.length; i++) {
      for (var j = 1; j < data.length; j++) {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {

          case 'equipoLocal':
            if ((data[j].datosPartido!.equipoLocal && data[j - 1].datosPartido!.equipoLocal) &&
              ((isAsc && data[j - 1].datosPartido!.equipoLocal!.toLowerCase() > data[j].datosPartido!.equipoLocal!.toLowerCase()) ||
                (!isAsc && data[j - 1].datosPartido!.equipoLocal!.toLowerCase() < data[j].datosPartido!.equipoLocal!.toLowerCase()))) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }
            break;

          case 'equipoVisitante':
            if ((data[j].datosPartido!.equipoVisitante && data[j - 1].datosPartido!.equipoVisitante) &&
              ((isAsc && data[j - 1].datosPartido!.equipoVisitante!.toLowerCase() > data[j].datosPartido!.equipoVisitante!.toLowerCase()) ||
                (!isAsc && data[j - 1].datosPartido!.equipoVisitante!.toLowerCase() < data[j].datosPartido!.equipoVisitante!.toLowerCase()))) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }
            break;

          case 'informador':
            if ((data[j].datosInformador && data[j - 1].datosInformador) &&
              ((isAsc && this.operationsService.nombreCompletoUsuario(data[j - 1].datosInformador!).toLocaleLowerCase() >
                this.operationsService.nombreCompletoUsuario(data[j].datosInformador!).toLowerCase()) ||
                (!isAsc && this.operationsService.nombreCompletoUsuario(data[j - 1].datosInformador!).toLowerCase() <
                  this.operationsService.nombreCompletoUsuario(data[j].datosInformador!).toLowerCase()))) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }
            break;

          case 'arbitroPrincipal':
            if ((data[j].datosArbitroPrincipal && data[j - 1].datosArbitroPrincipal) &&
              ((isAsc && this.operationsService.nombreCompletoUsuario(data[j - 1].datosArbitroPrincipal!).toLocaleLowerCase() >
                this.operationsService.nombreCompletoUsuario(data[j].datosArbitroPrincipal!).toLowerCase()) ||
                (!isAsc && this.operationsService.nombreCompletoUsuario(data[j - 1].datosArbitroPrincipal!).toLowerCase() <
                  this.operationsService.nombreCompletoUsuario(data[j].datosArbitroPrincipal!).toLowerCase()))) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }
            break;

          case 'arbitroAuxiliar':
            if ((data[j].datosArbitroAuxiliar && data[j - 1].datosArbitroAuxiliar) &&
              ((isAsc && this.operationsService.nombreCompletoUsuario(data[j - 1].datosArbitroAuxiliar!).toLocaleLowerCase() >
                this.operationsService.nombreCompletoUsuario(data[j].datosArbitroAuxiliar!).toLowerCase()) ||
                (!isAsc && this.operationsService.nombreCompletoUsuario(data[j - 1].datosArbitroAuxiliar!).toLowerCase() <
                  this.operationsService.nombreCompletoUsuario(data[j].datosArbitroAuxiliar!).toLowerCase()))) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }
            break;


          case 'fecha':
            if ((data[j].datosPartido!.fechaHora && data[j - 1].datosPartido!.fechaHora) &&
              ((isAsc && data[j - 1].datosPartido!.fechaHora! > data[j].datosPartido!.fechaHora!) ||
                (!isAsc && data[j - 1].datosPartido!.fechaHora! < data[j].datosPartido!.fechaHora!))) {
              aux = data[j - 1];
              data[j - 1] = data[j];
              data[j] = aux;
            }
            break;


        }
      }
    }

    this.listadoInformes = data;
    this.asignarDataSource();

  }

  // COMPROBACIONES PARA LAS ACCIONES A MOSTRAR
  esCreado(informe: DatosInforme) {
    return informe.estado === ESTADO_INFORME_CREADO;
  }

  esBorrador(informe: DatosInforme) {
    return informe.estado === ESTADO_INFORME_BORRADOR;
  }

  esTerminado(informe: DatosInforme) {
    return informe.estado === ESTADO_INFORME_TERMINADO;
  }
}
