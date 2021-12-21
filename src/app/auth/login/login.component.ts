import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // formSubmitted: boolean = false;
  formInvalid: boolean = false;

  loging: boolean = false;
  gLoging: boolean = false;

  loginForm = this.fb.group({
    nif: [ "" , [ Validators.required ] ],
    password: [ "" , [ Validators.required ] ],
    check: [ , [ ] ]
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  campoEsValido(campo: string) {
    return this.loginForm.controls[campo].errors &&
      this.loginForm.controls[campo].touched;
  }

  login() {
    if (this.loginForm.invalid) {
      this.formInvalid = true;
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loging = true;

    const v = this.authService.herokuLogin(
      this.loginForm.value['nif'], 
      this.loginForm.value['password']
    ).subscribe(      data => {
      this.loging = false;
      Swal.fire({
        title: 'Login',
        text: 'Login correcto',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
        // this.router.navigate(['/']);
      },
      error => {
        this.gLoging = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Usuario o contraseña incorrectos'
        });
      }
    );    
  }

}
