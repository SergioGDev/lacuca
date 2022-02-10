import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DatosCorte } from '../../interfaces/data.interface';
import { CortesService } from '../../services/cortes.service';

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
    private cortesService: CortesService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.cargandoCortes = true;
    this.cargandoVideotests = true;

    this.cortesService.obtenerListadoCompletoCortes()
      .subscribe(listadoCortesResp => {
        this.listadoCortes = listadoCortesResp;
        this.cargandoCortes = false;
      });
  }

  registrarNuevoVideotest() {
    this.router.navigateByUrl('/dashboard/zona-tests/admin-videotest/registrar-nuevo-videotest');
  }

}
