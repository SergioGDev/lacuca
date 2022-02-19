import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DialogModificarComponent } from '../../components/dialog-modificar/dialog-modificar.component';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';
import { Usuario } from '../../interfaces/usuario.interface';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-mis-datos',
  templateUrl: './editar-mis-datos.component.html',
  styleUrls: ['./editar-mis-datos.component.css']
})
export class EditarMisDatosComponent implements OnInit {

  @Input() user!: Usuario;

  editMode: boolean = false;
  editAdmin: boolean = false;

  formSubmitted: boolean = false;
  registrando: boolean = false;

  @Output() userSaved = new EventEmitter<Usuario>();
  
  
  registerForm = this.fb.group({
    nombre: new FormControl(this.editMode ? this.user.nombre : '', Validators.required),
    apellidos: new FormControl(this.editMode ? this.user.apellidos : '', Validators.required),
    email: new FormControl(this.editMode ? this.user.email : '', [Validators.required, Validators.email]),
    nif: new FormControl(this.editMode ? this.user.nif : '' , [ Validators.required, Validators.pattern("^[0-9]{8}[A-Z]$") ] ),
    delegacion: new FormControl(this.editMode ? this.user.delegacion : '', Validators.required),
  });

  passwordForm = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
    newPassword2: ['', [Validators.required]],    
  }, {
    validators: this.passwordsIguales('newPassword', 'newPassword2', 'oldPassword')
  });
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.router.url.endsWith('/editar-mis-datos')) {
      this.editMode = true;
      this.editAdmin = false;
      this.authService.herokuRenew().subscribe(
        res => {
          this.user = res.user;
          this.registerForm.patchValue({
            nombre: this.user.nombre,
            apellidos: this.user.apellidos,
            email: this.user.email,
            nif: this.user.nif,
            delegacion: this.user.delegacion,
            role: this.user.role
          });
        },
        err => {
          console.log(err);
          this.router.navigateByUrl('/dashboard')
        }
      );
    } 
  }

  // Para comprobar que las contraseñas sean iguales
  passwordsIguales(pass1Name: string, pass2Name: string, pass3Name: string){

    return ( formGroup: FormGroup ) => {
      const newPassword1 = formGroup.get(pass1Name)!;
      const newPassword2 = formGroup.get(pass2Name)!;
      const oldPassword = formGroup.get(pass3Name)!;

      if ( newPassword1.value === newPassword2.value ) {
        newPassword2.setErrors(null)
      } else {
        newPassword2.setErrors({ noEsIgual: true })
      }

      if ( oldPassword.value === newPassword1.value ) {
        newPassword1.setErrors({ esIgual: true })
      } else {
        newPassword1.setErrors(null)
      }
    }
  }

  // Comprueba que el campo sea o no válido
  campoNoValido( campo: string ): boolean {
    return ( this.registerForm.get(campo)!.invalid && this.formSubmitted ) ? true : false;
  }

  getFormValue(){
    return Object.assign({}, this.registerForm.value);
  }

  editarDatosUsuario() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const updateUser: Usuario = Object.assign({}, this.getFormValue(), {
      password: this.user.nif!.substring(0, 8),
      _id: this.user._id
    });

    const dialogRef = this.dialog.open( DialogModificarComponent,
      {
        restoreFocus: false,
        data: { modificado: false, mensajeDialog: '¿Actualizar tus datos de usuario?' }
      })

    dialogRef.afterClosed().subscribe(
      modificado => {
        if (modificado) {
          this.authService.herokuUpdateUser(updateUser).subscribe(
            () => {            
              this.dialog.open( DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'Tus datos han sido actualizados correctamente.'
                })
            
            },
            err => {
              console.log(err);
              this.dialog.open( DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'Ha ocurrido un error al actualizar tus datos de usuario. Inténtalo de nuevo más tarde.'
                })
            }
          );
        }
      }
    )
  }

  resetPassword() {
    this.user.password = this.user.password = this.user.nif!.substring(0, 8);
  }

  cambiarPassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const dialogRef = this.dialog.open( DialogModificarComponent,
      {
        restoreFocus: false,
        data: { modificado: false, mensajeDialog: '¿Estás seguro de que quieres cambiar la contraseña?' }
      })

    dialogRef.afterClosed().subscribe(
      modificado => {
        if (modificado) {
          const changePass = {
            oldPassword: this.passwordForm.get('oldPassword')!.value,
            newPassword: this.passwordForm.get('newPassword')!.value,
            nif: this.user.nif!
          }
          this.authService.herokuChangePassword(changePass.nif, 
            changePass.oldPassword, changePass.newPassword).subscribe(
            () => {
              this.dialog.open( DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'Tus contraseña ha sido actualizada correctamente.'
                })
            }, err => {
              console.log(err);
              this.dialog.open( DialogConfirmarComponent,
                {
                  restoreFocus: false,
                  data: 'Ha ocurrido un error al cambiar la contraseña. Inténtalo de nuevo más tarde.'
                })
            })
        }
      }
    )
  }

}
