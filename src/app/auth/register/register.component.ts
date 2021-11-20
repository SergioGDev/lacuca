import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { EmailUser } from '../../interfaces/auth.interface';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  formSubmitted: boolean = false;
  registrando: boolean = false;
  
  registerForm = this.fb.group({
    nombre: [ "Test" , Validators.required ],
    apellidos: [ "Test Apellidos" , Validators.required ],
    email: [ "test001@test.com" , [ Validators.required, Validators.email ] ],
    password: [ "12345678" , [ Validators.required, Validators.minLength(8) ] ],
    password2: [ "12345678" , [ Validators.required ]]
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // Para comprobar que las contraseñas sean iguales
  passwordsIguales(pass1Name: string, pass2Name: string ) {

    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.get(pass1Name)!;
      const pass2Control = formGroup.get(pass2Name)!;

      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors(null)
      } else {
        pass2Control.setErrors({ noEsIgual: true })
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

  // Comprueba que la contraseña sea o no válida
  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password')!.value;
    const pass2 = this.registerForm.get('password2')!.value;

    if ( (pass1 !== pass2) && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

  // Crea el nuevo usuario en caso de que no esté ya registrado
  crearUsuario() {
    this.formSubmitted = true;
    this.registrando = true;

    if ( this.registerForm.invalid ) {
      console.log("Formulario inválido!");
      return;
    }

    const nuevoUsuario: User = {
      nombre: this.registerForm.value['nombre'],
      apellidos: this.registerForm.value['apellidos'],
      email: this.registerForm.value['email'],
      rol: 'user',
      lastLogin: new Date(),
      firstLogin: new Date()
    }

    // Realizar el posteo
    this.authService.registrarNuevoUsuario( nuevoUsuario, this.registerForm.value['password'] )
      .then( () => this.registrando = false )
      .catch( () => this.registrando = false );

  }
}
