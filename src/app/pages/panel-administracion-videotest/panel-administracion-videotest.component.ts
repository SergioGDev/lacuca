import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DatosVideotest } from '../../interfaces/data.interface';
import { VideotestService } from '../../services/videotest.service';
import { InterdataService } from '../../services/interdata.service';

@Component({
  selector: 'app-panel-administracion-videotest',
  templateUrl: './panel-administracion-videotest.component.html',
  styleUrls: ['./panel-administracion-videotest.component.css']
})
export class PanelAdministracionVideotestComponent implements OnInit {

  listadoVideotest: DatosVideotest[] = [];

  cargandoVideotests: boolean = false;
  cargandoCortes: boolean = false;

  constructor(
    private videotestService: VideotestService,
    private interdataService: InterdataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.interdataService.limpiarCache();

    this.cargandoVideotests = true; 
    this.videotestService.obtenerListadoCompletoVideotest().subscribe(
      ({videotests}) => {
        this.listadoVideotest = videotests;
        this.cargandoVideotests = false;
      }
    )
  }

  registrarNuevoVideotest() {
    this.router.navigateByUrl('/dashboard/zona-tests/admin-videotest/registrar-nuevo-videotest');
  }

}
