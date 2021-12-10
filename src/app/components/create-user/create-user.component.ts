import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'create-user-comp',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  editMode: boolean = true;

  @Input() user: User = {
    nombre: 'Jesús',
    apellidos: 'Ferrer',
    email: 'xule@xule.com',
    nif: '12345678A',
    delegacion: 'Sur',
    role: ['ROLE_ADMIN', 'ROLE_INFORMADOR'],
  }

  formSubmitted: boolean = false;
  registrando: boolean = false;

  delegaciones: string[] = ['', 'Norte', 'Cáceres', 'La Serena', 'Mérida', 'Badajoz', 'Sur', 'Almendralejo'];
  
  roles = [
    {description: 'Administrador', value: 'ROLE_ADMIN'},
    {description: 'Informador', value: 'ROLE_INFORMADOR'},
    {description: 'Árbitro', value: 'ROLE_ARBITRO'},
  ];
  
  registerForm = this.fb.group({
    nombre: new FormControl(this.editMode ? this.user.nombre : '', Validators.required),
    apellidos: new FormControl(this.editMode ? this.user.apellidos : '', Validators.required),
    email: new FormControl(this.editMode ? this.user.email : '', [Validators.required, Validators.email]),
    nif: new FormControl(this.editMode ? this.user.nif : '' , [ Validators.required, Validators.pattern("^[0-9]{8}[A-Z]$") ] ),
    delegacion: new FormControl(this.editMode ? this.user.delegacion : '', Validators.required),
    role: this.fb.array(this.roles.map(rol => this.editMode && this.user.role!.indexOf(rol.value)> -1))
  });
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
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
    
    if(this.editMode) {
      this.editUser();
    } else {
      this.saveNewUSer();
    }

    // this.formSubmitted = true;
    // this.registrando = true;

    // if ( this.registerForm.invalid ) {
    //   console.log("Formulario inválido!");
    //   return;
    // }

    // const nuevoUsuario: User = {
    //   nombre: this.registerForm.value['nombre'],
    //   apellidos: this.registerForm.value['apellidos'],
    //   email: this.registerForm.value['email'],
    //   rol: 'user',
    //   lastLogin: new Date(),
    //   firstLogin: new Date()
    // }

    // Realizar el posteo
    // this.authService.registrarNuevoUsuario( nuevoUsuario, this.registerForm.value['password'] )
    //   .then( () => this.registrando = false )
    //   .catch( () => this.registrando = false );

  }

  getFormValue(){
    return Object.assign({}, this.registerForm.value, {
      role: this.convertToValue('role')
    });
  }

  saveNewUSer() {
    const newUser = Object.assign({}, this.getFormValue(), {
      password: this.user.nif!.substr(0, 8)
    });
    Swal.fire({
      title: 'Crear usuario',
      text: '¿Estás seguro de que quieres crear este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crearlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.authService.herokuNewCompleteUser(newUser).subscribe(
          res => {
            Swal.fire(
              'Usuario creado',
              'El usuario ha sido creado correctamente',
              'success'
            )
            //this.router.navigate(['/users']);
          
          },
          err => {
            Swal.fire(
              'Error',
              'Ha ocurrido un error al crear el usuario',
              'error'
            )
          }
        );        
      }
    });
  }

  editUser() {
    Swal.fire({
      title: 'Editar usuario',
      text: '¿Estás seguro de que quieres editar este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, editarlo!'
    }).then((result) => {
      if(result.isConfirmed){
        console.log(this.getFormValue());
      }
    });
  }


  convertToValue(key: string) {
    return this.registerForm.value[key].map((v: string, i: number) => v ? this.roles[i] : null).filter((v: null) => v !== null).map((v: any) => v.value);
  }

  // onCheckChange(event: any): void {
  //   const formArray: FormArray = this.registerForm.get('role') as FormArray;
  
  //   /* Selected */
  //   if(event.target.checked){
  //     console.log(event.target);
  //     // Add a new control in the arrayForm
  //     formArray.push(new FormControl(event.target.value));
  //   }
  //   /* unselected */
  //   else{
  //     // find the unselected element
  //     let i: number = 0;
  
  //     formArray.controls.forEach((ctrl) => {
  //       if(ctrl.value == event.target.value) {
  //         // Remove the unselected element from the arrayForm
  //         formArray.removeAt(i);
  //         return;
  //       }
  
  //       i++;
  //     });
  //   }
  //   console.log(this.registerForm.value);
  // }

  resetPassword() {
    this.user.password = this.user.password = this.user.nif!.substr(0, 8);
  }
}
