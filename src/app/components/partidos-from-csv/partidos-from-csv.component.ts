import { Component, OnInit } from '@angular/core';
import { DatosPartido } from 'src/app/interfaces/data.interface';
import Swal from 'sweetalert2';
import { zip } from "rxjs";
import { PartidosService } from '../../services/partidos.service';

@Component({
  selector: 'app-partidos-from-csv',
  templateUrl: './partidos-from-csv.component.html',
  styleUrls: ['./partidos-from-csv.component.css']
})
export class PartidosFromCsvComponent implements OnInit {

  constructor(
    private partidosService: PartidosService
    ) { }

  ngOnInit() {
  }

  loadCsv(event: any){
    const filas: any[] = event;
    const partidos: DatosPartido[] = [];
    filas.forEach(fila => {
      const partido = this.parsePartido(fila);
      if(partido){
        partidos.push(partido);
      }
    });
    const arrObs = zip(...partidos.map(u => this.partidosService.guardarPartido(u)));
    arrObs.subscribe(
      data => {
        Swal.fire({
          title: 'Usuarios creados',
          text: 'Se han creado los usuarios correctamente',
          icon: 'success'
        });
      },
      error => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: 'Se ha producido un error al crear los usuarios',
          icon: 'error'
        });
      }
    );
  }

  parsePartido(csv: any) : DatosPartido | null{
    const { equipoLocal, equipoVisitante, fechaHora, localidad, url, fase, jornada, comentario } = csv;
    if(!equipoLocal || !equipoVisitante || !fechaHora || !localidad || !fase || !jornada || !comentario){      
      return null;
    }
    return {
      equipoLocal,
      equipoVisitante,
      fechaHora,
      localidad,
      url,
      fase,
      jornada,
      comentario,
      status: true
    };
  }

}
