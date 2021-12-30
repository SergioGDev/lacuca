import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DatosPartido } from '../../interfaces/data.interface';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['../pages.component.css', './partidos.component.css']
})
export class PartidosComponent implements OnInit {

  cargandoListado: boolean = false;
  listadoPartidos: DatosPartido[] = [];
  displayedColumns: string[] = ['equipoLocal', 'equipoVisitante', 'fechaHora', 'localidad', 'acciones'];

  constructor(
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.cargarListadoPartidos();
  }
  
  cargarListadoPartidos(): void {
    
    this.cargandoListado = true;
    
    this.dataService.obtenerListadoPartidos()
      .subscribe( resp => {
        this.cargandoListado = false;
        this.listadoPartidos = resp;
      })
    
  }

  registrarPartido(): void {
    this.router.navigateByUrl('/dashboard/partidos/registrar-nuevo-partido');
  }

  eliminarPartido(idPartido: string): void {
    if (idPartido) {
      this.dataService.eliminarPartido(idPartido)
      .subscribe ( 
        () => this.cargarListadoPartidos(), 
        err => console.log(err));
    }
  }

}
