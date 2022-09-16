import { Component, OnInit } from '@angular/core';
import { InterdataService } from '../../services/interdata.service';
import { VideotestService } from '../../services/videotest.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatosVideotest } from '../../interfaces/data.interface';
import { PartidosService } from '../../services/partidos.service';
import { CortesService } from '../../services/cortes.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-visualizar-videotest',
  templateUrl: './visualizar-videotest.component.html',
  styleUrls: ['./visualizar-videotest.component.css']
})
export class VisualizarVideotestComponent implements OnInit {

  datosVideotest?: DatosVideotest;
  cargandoVideotest: boolean = false;

  constructor(
    private interdataService: InterdataService,
    private videotestService: VideotestService,
    private partidosService: PartidosService,
    private cortesService: CortesService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const idVideotest = this.interdataService.getIdVideotestFromCache();

    if (idVideotest) {
      this.cargandoVideotest = true;
      this.videotestService.obtenerDatosVideotest(idVideotest).pipe(
        switchMap( datosVideotestResp => {
          this.datosVideotest = datosVideotestResp;
          var vCortes: string[] = [];
          this.datosVideotest.preguntas?.forEach(pregunta => {
            vCortes.push(pregunta.idCorte);
          })

          return this.cortesService.obtenerDatosCompletosListadoCortes(vCortes);
        })
      )
        .subscribe( vCortesResp => {
          const vCortes = vCortesResp;

          vCortes.forEach( corte => {
            this.datosVideotest?.preguntas?.forEach( pregunta => {
              if (corte._id === pregunta.idCorte) {
                pregunta.corte = corte;
              }
            })
          });

          this.cargandoVideotest = false;
        });
    } else {
      this.router.navigateByUrl('/dashboard/zona-tests/admin-videotest');
    }
  }

  volverAlListado() {
    this.router.navigateByUrl('/dashboard/zona-tests/admin-videotest')
  }

}
