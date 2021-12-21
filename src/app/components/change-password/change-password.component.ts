import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'change-password-comp',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
   
  registerForm = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
    newPassword2: ['', [Validators.required]],    
  }, {
    validators: this.passwordsIguales('newPassword', 'newPassword2', 'oldPassword')
  });

  formSubmitted: boolean = false;
  registrando: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
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
    
    if ( this.registerForm.get(campo)!.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

  // Crea el nuevo usuario en caso de que no esté ya registrado
  onSubmit() {
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, revisa los campos resaltados'
      });
      return;
    }
    Swal.fire({
      title: 'Cambiar contraseña',
      text: '¿Estás seguro de que quieres cambiar la contraseña?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiarla!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        const changePass = {
          oldPassword: this.registerForm.get('oldPassword')!.value,
          newPassword: this.registerForm.get('newPassword')!.value,
          nif: '44410688Z'
        }
        this.authService.herokuChangePassword(changePass.nif, changePass.oldPassword, changePass.newPassword).subscribe(
          res => {
            Swal.fire(
              'Contraseña cambiada',
              'La contraseña se ha cambiado correctamente',
              'success'
            )
            //this.router.navigate(['/users']);
          
          },
          err => {
            Swal.fire(
              'Error',
              'Ha ocurrido un error al cambiar la contraseña',
              'error'
            )
          }
        );        
      }
    });   
  }

  

}
