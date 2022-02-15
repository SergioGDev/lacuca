import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { DatosRol } from '../../interfaces/data.interface';
import { InterdataService } from '../../services/interdata.service';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../interfaces/usuario.interface';
import { DialogModificarComponent } from '../../components/dialog-modificar/dialog-modificar.component';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { DialogRegistrarComponent } from '../../components/dialog-registrar/dialog-registrar.component';

@Component({
  selector: 'app-registrar-nuevo-usuario',
  templateUrl: './registrar-nuevo-usuario.component.html',
  styleUrls: ['./registrar-nuevo-usuario.component.css']
})
export class RegistrarNuevoUsuarioComponent implements OnInit {

  vRoles: DatosRol[] = this.dataService.obtenerVRoles();
  vDelegaciones: string[] = this.dataService.obtenerVDelegaciones();

  cargandoGrupos: boolean = true;

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

    } else if (!this.router.url.includes('registrar-usuario')) {
      this.router.navigateByUrl('/dashboard/listado-usuarios')
    }
  }

  submit() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // TODO: AÑADIR LA OPCIÓN PARA LA CREACIÓN DE UN NUEVO USUARIO
    const dialogRef = this.user !== undefined ?
     this.dialog.open(DialogModificarComponent,
        { 
          restoreFocus: false, 
          data: { 
            modificado: false,
            mensajeDialog: '¿Desea modificar los datos del usuario?',
          }
        }) :
      this.dialog.open( DialogRegistrarComponent,
        { 
          restoreFocus: false, 
          data: { 
            modificado: false,
            mensajeDialog: '¿Desea registrar el nuevo usuario con estos datos?',
          }
        })

    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        // TODO: AÑADIR LA OPCIÓN DE NUEVO USUARIO CON UN TERNARIO (MIRAR REGISTRAR NUEVO PARTIDO)
        this.user ? this.modificarUsuario() : this.registrarUsuario();
      }
    })
  }

  modificarUsuario() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const updateUser: Usuario = Object.assign({}, this.registerForm.value, {
      password: this.user!.nif!.substring(0, 8),
      _id: this.user!._id
    })
    
    this.authService.herokuUpdateUser(updateUser)
      .subscribe( () => {
      this.dialog.open(DialogConfirmarComponent,
        { 
          restoreFocus: false, 
          data: 'Datos del usuario modificados correctamente.'
        });
      this.router.navigateByUrl('/dashboard/listado-usuarios');
    }, (err) => {
      console.log(err)
      this.dialog.open(DialogConfirmarComponent,
        { 
          restoreFocus: false, 
          data: 'Ha ocurrido un error inesperado al intentar modificar los datos. Inténtelo de nuevo más tarde y consulte con el administrador del sitio.' 
        });
      this.router.navigateByUrl('/dashboard/listado-usuarios');
    });

  } 

  registrarUsuario() {

    console.log(this.registerForm);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const newUser: Usuario = Object.assign({}, this.registerForm.value, {
      password: this.registerForm.get('nif')!.value.substring(0, 8)
    })

    this.authService.herokuNewUser(newUser).subscribe(
      () => {
        this.dialog.open(DialogConfirmarComponent,
          { 
            restoreFocus: false, 
            data: 'El usuario ha sido registrado correctamente.'
          });
        this.router.navigateByUrl('/dashboard/listado-usuarios');
      }, err => {
        console.log(err)
        this.dialog.open(DialogConfirmarComponent,
          { 
            restoreFocus: false, 
            data: 'Ha ocurrido un error inesperado al intentar registrar al usuario. Inténtelo de nuevo más tarde y consulte con el administrador del sitio.' 
          });
      }
    )
  }
}
