import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { InterdataService } from '../../services/interdata.service';
import { GruposService } from '../../services/grupos.service';
import { DatosGrupo } from 'src/app/interfaces/data.interface';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs/operators';
import { DialogEliminarComponent } from '../../components/dialog-eliminar/dialog-eliminar.component';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';

@Component({
  selector: 'app-datos-grupo',
  templateUrl: './datos-grupo.component.html',
  styleUrls: ['./datos-grupo.component.css']
})
export class DatosGrupoComponent implements OnInit {

  datosGrupo?: DatosGrupo;
  cargandoDatosGrupo: boolean = false;

  constructor(
    private interdataService: InterdataService,
    private gruposService: GruposService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const idGrupo = this.interdataService.getIdGrupoFromCache();
    
    if (idGrupo) {
      this.cargandoDatosGrupo = true;
      this.gruposService.obtenerGrupoConResponsablesYArbitros(idGrupo)
        .subscribe( datosGrupoResp => {
        this.datosGrupo = datosGrupoResp;
        this.cargandoDatosGrupo = false;
      })

    } else {
      this.router.navigateByUrl('/dashboard/listado-usuarios');
    }
  }

  modificarGrupo() {
    this.interdataService.setIdGrupoToCache(this.datosGrupo?._id!);
    this.router.navigateByUrl('/dashboard/listado-usuarios/editar-grupo');
  }
  
  eliminarGrupo(grupo: DatosGrupo) {
    const dialogRef = this.dialog.open( DialogEliminarComponent,
      {
        restoreFocus: false,
        data: {
          eliminado: false,
          mensajeDialog: '¿Quieres eliminar los datos del grupo? ¡Cuidado! Esta acción no podrá deshacerse.'
        }
      })

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.gruposService.eliminarGrupo(grupo._id!).subscribe(
            () => {
              this.router.navigateByUrl('/dashboard/listado-usuarios');
              this.dialog.open( DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'El grupo se ha eliminado correctamente.'
                })
            }, 
            err => {
              console.log(err);
              this.dialog.open( DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'Ha ocurrido un error al eliminar los datos del grupo. Inténtelo de nuevo más tarde.'
                });
            }
          )
        }
      }
    )
  }

}
