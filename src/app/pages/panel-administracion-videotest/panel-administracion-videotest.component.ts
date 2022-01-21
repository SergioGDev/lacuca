import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DatosCorte } from '../../interfaces/data.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-administracion-videotest',
  templateUrl: './panel-administracion-videotest.component.html',
  styleUrls: ['./panel-administracion-videotest.component.css']
})
export class PanelAdministracionVideotestComponent implements OnInit {

  listadoCortes: DatosCorte[] = [];

  cargandoVideotests: boolean = false;
  cargandoCortes: boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.cargandoCortes = true;
    this.cargandoVideotests = true;

    this.dataService.obtenerListadoCompletoCortes()
      .subscribe(listadoCortesResp => {
        this.listadoCortes = listadoCortesResp;
        this.cargandoCortes = false;
      });
  }

  registrarNuevoVideotest() {
    this.router.navigateByUrl('/dashboard/zona-tests/admin-videotest/registrar-nuevo-videotest');
  }

}
