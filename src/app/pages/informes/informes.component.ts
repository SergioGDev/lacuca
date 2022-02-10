import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DatosInforme, DatosPartido } from '../../interfaces/data.interface';
import { InformesService } from '../../services/informes.service';
import { InterdataService } from '../../services/interdata.service';
import { OperationsService } from '../../services/operations.service';
import { ESTADO_INFORME_CREADO, ESTADO_INFORME_BORRADOR, ESTADO_INFORME_TERMINADO } from '../../interfaces/constantes.interface';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {

  cargandoInformes: boolean = true;
  listadoInformes: DatosInforme[] = [];
  
  constructor(
    private informesService: InformesService,
    private operationsService: OperationsService,
    private interdataService: InterdataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.cargandoInformes = true;
    this.informesService.obtenerListadoInformesConDatos().then(
      listadoInformesResp => {
        this.listadoInformes = listadoInformesResp;
        this.cargandoInformes = false;
      });
    
  }

  mostrarTabla(): boolean {
    return !this.cargandoInformes && this.listadoInformes.length !== 0 && 
      this.listadoInformes[this.listadoInformes.length-1].datosPartido !== undefined &&
      this.listadoInformes[this.listadoInformes.length-1].datosPartido?.fechaHora !== undefined &&
      this.listadoInformes[this.listadoInformes.length-1].datosInformador !== undefined &&
      this.listadoInformes[this.listadoInformes.length-1].datosArbitroAuxiliar !== undefined &&
      this.listadoInformes[this.listadoInformes.length-1].datosArbitroPrincipal !== undefined;
  }

  // Cambio de vista
  registrarInforme() {
    this.router.navigateByUrl('/dashboard/informes/nuevo-informe');
  }

  realizarInforme(idInforme: string) {
    this.interdataService.setIdInformeToCache(idInforme);
    this.router.navigateByUrl('/dashboard/informes/realizar-informe');
  }



}
