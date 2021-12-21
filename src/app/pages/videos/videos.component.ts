import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DatosPartido } from '../../interfaces/data.interface';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['../pages.component.css', './videos.component.css']
})
export class VideosComponent implements OnInit {

  cargandoListado: boolean = false;
  listadoPartidos: DatosPartido[] = [];
  displayedColumns: string[] = ['equipoLocal', 'equipoVisitante', 'fechaHora', 'localidad', 'acciones'];

  constructor(
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.cargandoListado = true;
    
    this.dataService.obtenerListadoPartidos()
      .subscribe( resp => {
        this.cargandoListado = false;
        this.listadoPartidos = resp;
        console.log(this.listadoPartidos);
      })
  }

  registrarPartido(): void {
    this.router.navigateByUrl('/dashboard/videos/registrar-nuevo-partido');
  }

}
