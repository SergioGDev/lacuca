import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { InterdataService } from '../../services/interdata.service';
import { GruposService } from '../../services/grupos.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { ROLE_INFORMADOR, ROLE_ARBITRO } from '../../interfaces/auth.interface';
import { DialogRegistrarComponent } from '../../components/dialog-registrar/dialog-registrar.component';
import { DatosGrupo } from '../../interfaces/data.interface';
import { DialogModificarComponent } from '../../components/dialog-modificar/dialog-modificar.component';

@Component({
  selector: 'app-registrar-grupo',
  templateUrl: './registrar-grupo.component.html',
  styleUrls: ['./registrar-grupo.component.css']
})
export class RegistrarGrupoComponent implements OnInit {

  listadoInformadores: Usuario[] = [];
  listadoArbitrosSeleccionados: string[] = [];
  listadoCompletoArbitros: Usuario[] = [];
  datosGrupo?: DatosGrupo;

  cargandoUsuarios: boolean = false;
  cargandoGrupos: boolean = false;

  formGrupo: FormGroup = this.fb.group({
    descripcion: [, [Validators.required]],
    responsables: [, []],
    arbitros: [ , []]
  })

  constructor(
    private interdataService: InterdataService,
    private gruposService: GruposService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    if (this.router.url.includes('editar-grupo')) {
      const idGrupo = this.interdataService.getIdGrupoFromCache();

      if (idGrupo) {
        this.cargandoGrupos = true;
        this.gruposService.obtenerGrupo(idGrupo).pipe(
          switchMap( grupoResp => {
            this.datosGrupo = grupoResp;
            return this.authService.herokuGetUserListProtected();
          })
        ).subscribe(
          listadoUsuariosResp => {
            this.listadoCompletoArbitros = listadoUsuariosResp;
            this.listadoCompletoArbitros.forEach( usuario => {
              if (usuario.grupos?.includes(this.datosGrupo!._id!)) {
                this.listadoArbitrosSeleccionados.push(usuario._id!);
              }
            })

            this.formGrupo.setValue({
              descripcion: this.datosGrupo?.descripcion,
              responsables: this.datosGrupo?.responsables,
              arbitros: this.listadoArbitrosSeleccionados
            })

            console.log(this.formGrupo.value);
            this.cargandoGrupos = false;
          }
        );

      } else {
        this.router.navigateByUrl('/dashboard/listado-usuarios');
      }
    }

    this.cargandoUsuarios = true;
    this.authService.herokuGetUserListProtected().subscribe(
      listadoUsuariosResp => {

        listadoUsuariosResp.forEach(usuario => {
          if (usuario.role!.includes(ROLE_INFORMADOR)) {
            this.listadoInformadores.push(usuario);
          }

          if (usuario.role!.includes(ROLE_ARBITRO)) {
            this.listadoCompletoArbitros.push(usuario);
          }
        })
        this.cargandoUsuarios = false;

      },
      err => {
        console.log(err);
        this.router.navigateByUrl('/dashboard/listado-usuarios');
        this.dialog.open(DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'Ha ocurrido un error. Inténtelo de nuevo más tarde.'
          })
      }
    )
  }

  cargando() {
    return this.cargandoUsuarios || this.cargandoGrupos;
  }

  registrarGrupo() {
    const grupo: DatosGrupo = this.formGrupo.value;
    grupo.responsables = grupo.responsables ? grupo.responsables : [];

    this.gruposService.registrarGrupo(grupo).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard/listado-usuarios');
        this.dialog.open(DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'El grupo se ha registrado correctamente.'
          });
      },
      err => {
        console.log(err);
        this.dialog.open(DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'Ha ocurrido un error al registrar el grupo. Inténtelo de nuevo más tarde.'
          });
      }
    )
  }

  modificarGrupo() {
    this.datosGrupo!.descripcion = this.formGrupo.get('descripcion')!.value;
    this.datosGrupo!.responsables = this.formGrupo.get('responsables')!.value;

    this.gruposService.actualizarGrupo(this.datosGrupo!).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard/listado-usuarios');
        this.dialog.open(DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'El grupo se ha modificado correctamente.'
          });
      },
      err => {
        console.log(err);
        this.dialog.open(DialogConfirmarComponent,
          {
            restoreFocus: false,
            data: 'Ha ocurrido un error al modificar el grupo. Inténtelo de nuevo más tarde.'
          });
      }
    )
  }

  submit() {
    if (this.formGrupo.invalid) {
      this.formGrupo.markAllAsTouched();
      return;
    }

    const dialogRef = this.datosGrupo ?
      this.dialog.open(DialogModificarComponent,
        {
          restoreFocus: false,
          data: { registrado: false, mensajeDialog: '¿Quieres modificar los datos del grupo?' }
        }) :
      this.dialog.open(DialogRegistrarComponent,
        {
          restoreFocus: false,
          data: { registrado: false, mensajeDialog: '¿Quieres registrar los datos del grupo?' }
        });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.datosGrupo ? this.modificarGrupo() : this.registrarGrupo();

        }
      }
    )
  }

}
