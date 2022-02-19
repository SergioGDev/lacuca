import { Component, OnInit, OnDestroy } from '@angular/core';
import { InterdataService } from '../../services/interdata.service';
import { InformesService } from '../../services/informes.service';
import { Router } from '@angular/router';
import { DatosInforme } from '../../interfaces/data.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';

@Component({
  selector: 'app-visualizar-datos-informe',
  templateUrl: './visualizar-datos-informe.component.html',
  styleUrls: ['./visualizar-datos-informe.component.css']
})
export class VisualizarDatosInformeComponent implements OnInit {

  datosInforme?: DatosInforme;

  cargandoInforme: boolean = false;

  constructor(
    private interdataService: InterdataService,
    private informesService: InformesService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const idInforme = this.interdataService.getIdInformeFromCache();

    if (idInforme) {
      this.cargandoInforme = true;
      this.informesService.obtenerInformeCompleto(idInforme).subscribe(
        informeResp => {
          this.datosInforme = informeResp;
          this.cargandoInforme = false;
        },
        err => {
          console.log(err);

          this.router.navigateByUrl('/dashboard/informes');
          this.dialog.open( DialogConfirmarComponent,
            {
              restoreFocus: false,
              data: 'Ha ocurrido un error al obtener los datos del informe. Inténtelo de nuevo más tarde. Póngase en contacto con el administrador del sitio.'
            })
        }
      )
    } else {
      // Si no hay informe asignado volvemos al listado de informes
      this.router.navigateByUrl('/dashboard/informes');
    }
  }

  volverAlListado() {
    this.router.navigateByUrl('/dashboard/informes');
  }
}
