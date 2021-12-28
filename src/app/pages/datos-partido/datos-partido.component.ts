import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { switchMap, tap } from 'rxjs/operators';
import { DatosPartido } from '../../interfaces/data.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogEliminarVideoComponent } from '../../components/dialog-eliminar-video/dialog-eliminar-video.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-datos-partido',
  templateUrl: './datos-partido.component.html',
  styleUrls: ['./datos-partido.component.css']
})
export class DatosPartidoComponent implements OnInit {

  datosPartido!: DatosPartido;
  cargando: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit(): void {

    this.cargando = true;
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.dataService.obtenerDatosPartido(id))
      )
      .subscribe(({ partido }) => {
        this.datosPartido = partido;
        this.cargando = false;
      });

  }

  urlVideoPartido(): string {
    return `https://www.youtube.com/watch?v=${this.datosPartido.url}`;
  }

  generarNuevoCorte() {
    this.router.navigateByUrl(`/dashboard/videos/partido/${this.datosPartido._id}/nuevo-corte`);
  }

  modificarPartido() {
    this.router.navigateByUrl(`/dashboard/videos/modificar-partido/${this.datosPartido._id}`)
  }

  eliminarPartido() {
    const dialogRef = this.dialog.open(DialogEliminarVideoComponent,
      { restoreFocus: false, data: { id: this.datosPartido._id, borrado: null } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.dataService.eliminarPartido(this.datosPartido._id!)
          .subscribe(() => {

            // Partido borrado
            this.router.navigateByUrl('/dashboard/videos');

            Swal.fire({
              title: 'Partido borrado',
              text: 'Se ha borrado el partido correctamente.',
              icon: 'success'
            });

          }, err => {
            console.log(err);
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al intentar eliminar el partido. Inténtelo de nuevo más tarde.',
              icon: 'error'
            })
          });

      }
    }, err => {
      console.log(err);
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al intentar eliminar el partido. Inténtelo de nuevo más tarde.',
        icon: 'error'
      })
    })
  }

}
