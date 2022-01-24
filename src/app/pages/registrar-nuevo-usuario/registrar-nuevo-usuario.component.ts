import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { DatosRol } from '../../interfaces/data.interface';
import { InterdataService } from '../../services/interdata.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogModificarUsuarioComponent } from '../../components/dialog-modificar-usuario/dialog-modificar-usuario.component';
import { Usuario } from '../../interfaces/usuario.interface';
import { DialogConfirmarUsuarioModificadoComponent } from '../../components/dialog-confirmar-usuario-modificado/dialog-confirmar-usuario-modificado.component';
import { DialogConfirmarErrorComponent } from '../../components/dialog-confirmar-error/dialog-confirmar-error.component';

@Component({
  selector: 'app-registrar-nuevo-usuario',
  templateUrl: './registrar-nuevo-usuario.component.html'
})
export class RegistrarNuevoUsuarioComponent implements OnInit, OnDestroy {

  vRoles: DatosRol[] = this.dataService.obtenerVRoles();
  vDelegaciones: string[] = this.dataService.obtenerVDelegaciones();

  user?: Usuario;

  registerForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    nif: ['', [Validators.required, Validators.pattern("^[0-9]{8}[A-Z]$")]],
    delegacion: ['', [Validators.required]],
    role: [''],
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private interdataService: InterdataService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {

    if (this.router.url.includes('editar-usuario')) {
      const user = this.interdataService.getUserFromCache();
      if (user) {
        this.user = user;
        this.registerForm.setValue({
          nombre: user.nombre,
          apellidos: user.apellidos,
          email: user.email,
          nif: user.nif,
          delegacion: user.delegacion,
          role: user.role,
        })
      } else {
        this.router.navigateByUrl('/dashboard/listado-usuarios');
      }
    }
  }

  ngOnDestroy(): void {
    this.interdataService.removeUserFromCache();
  }

  submit() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const dialogRef = this.dialog.open(DialogModificarUsuarioComponent,
      { restoreFocus: false, data: { modificado: false }});

    // const dialogRef = this.user ?
    //   this.dialog.open(DialogModificarUsuarioComponent,
    //     { restoreFocus: false, data: { modificado: false } }) ?
      // this.dialog.open(DialogNuevoPartidoComponent,
      //   { restoreFocus: false, data: { guardado: false } });

    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        // TODO: AÑADIR LA OPCIÓN DE NUEVO USUARIO CON UN TERNARIO (MIRAR REGISTRAR NUEVO PARTIDO)
        this.modificarUsuario();
      }
    })
  }

  modificarUsuario() {
    

    const updateUser: Usuario = Object.assign({}, this.registerForm.value, {
      password: this.user!.nif!.substring(0, 8),
      _id: this.user!._id
    })
    console.log("Usuario a modificar:", updateUser)
    
    this.authService.herokuUpdateUser(updateUser).subscribe( () => {
      this.dialog.open(DialogConfirmarUsuarioModificadoComponent,
        { restoreFocus: false });
      this.router.navigateByUrl('/dashboard/listado-usuarios');
    }, err => {
      this.dialog.open(DialogConfirmarErrorComponent,
        { restoreFocus: false });
      this.router.navigateByUrl('/dashboard/listado-usuarios');
    });

  } 
}
