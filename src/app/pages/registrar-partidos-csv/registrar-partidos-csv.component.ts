import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { zip } from "rxjs";

import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { DatosPartido } from '../../interfaces/data.interface';
import { PartidosService } from '../../services/partidos.service';
import { OperationsService } from '../../services/operations.service';

@Component({
  selector: 'app-registrar-partidos-csv',
  templateUrl: './registrar-partidos-csv.component.html'
})
export class RegistrarPartidosCsvComponent {

  textoBotonAdjuntar: string = 'Adjuntar fichero';

  constructor(
    private partidosService: PartidosService,
    private operationsService: OperationsService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  loadCsv(event: any){
    const filas: any[] = event;
    const partidos: DatosPartido[] = [];
    filas.forEach(fila => {
      const partido = this.parsePartido(fila);
      if(partido){
        partidos.push(partido);
      }
    });
    partidos.forEach(partido => {
      partido.fechaHora = new Date(partido.fechaHora);
    })
    
    const arrObs = zip(...partidos.map(u => this.partidosService.guardarPartido(u)));
    arrObs.subscribe(
      data => {
        this.router.navigateByUrl('/dashboard/partidos')
        this.dialog.open( DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'Se han añadido todos los partidos correctamente.'
          })
      },
      error => {
        console.log(error);
        this.dialog.open( DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'Se ha producido un error al intentar añadir los partidos. Inténtelo de nuevo más tarde y contacte con el administrador del sitio.'
          })
      }
    );
  }

  parsePartido(csv: any) : DatosPartido | null{
    const { equipoLocal, equipoVisitante, fechaHora, localidad, url, fase, jornada, comentario } = csv;
    if(!equipoLocal || !equipoVisitante || !fechaHora || !localidad || !fase || !jornada || !url || this.operationsService.checkYouTubeURL(url)){      
      return null;
    }

    const dia = fechaHora.split('/')[0].length === 1 ? ('0').concat(fechaHora.split('/')[0]) : fechaHora.split('/')[0];
    const mes = fechaHora.split('/')[1].length === 1 ? ('0').concat(fechaHora.split('/')[1]) : fechaHora.split('/')[1];
    const anno = fechaHora.split('/')[2].length === 2 ? ('20').concat(fechaHora.split('/')[2]) : fechaHora.split('/')[2];
    
    const fechaHoraDate = new Date(parseInt(anno), parseInt(mes) - 1, parseInt(dia))
    return {
      equipoLocal,
      equipoVisitante,
      fechaHora: fechaHoraDate,
      localidad,
      url: this.operationsService.getYouTubeID(url),
      fase,
      jornada,
      comentario,
      status: true
    };
  }
}
