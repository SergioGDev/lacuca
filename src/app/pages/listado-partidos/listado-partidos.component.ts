import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DatosPartido } from '../../interfaces/data.interface';
import { PartidosService } from '../../services/partidos.service';
import { InterdataService } from '../../services/interdata.service';

@Component({
  selector: 'app-listado-partidos',
  templateUrl: './listado-partidos.component.html',
  styleUrls: ['./listado-partidos.component.css']
})
export class ListadoPartidosComponent implements OnInit {

  cargandoListado: boolean = false;
  listadoPartidos: DatosPartido[] = [];
  displayedColumns: string[] = ['equipoLocal', 'equipoVisitante', 'fechaHora', 'localidad', 'acciones'];

  constructor(
    private router: Router,
    private partidosService: PartidosService,
    private interdataService: InterdataService
  ) { }

  ngOnInit(): void {
    this.cargarListadoPartidos();
    this.interdataService.limpiarCache();
  }
  
  cargarListadoPartidos(): void {
    
    this.cargandoListado = true;
    
    this.partidosService.obtenerListadoPartidos()
      .subscribe( resp => {
        this.cargandoListado = false;
        this.listadoPartidos = resp;
      })
    
  }

  irComponenteCSV(): void {
    this.router.navigateByUrl('/dashboard/partidos/registrar-listado-partidos')
  } 

  registrarPartido(): void {
    this.router.navigateByUrl('/dashboard/partidos/registrar-nuevo-partido');
  }

  eliminarPartido(idPartido: string): void {
    if (idPartido) {
      this.partidosService.eliminarPartido(idPartido)
      .subscribe ( 
        () => this.cargarListadoPartidos(), 
        err => console.log(err));
    }
  }

}
