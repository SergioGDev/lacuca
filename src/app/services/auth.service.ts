import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import { GoogleAuthProvider } from 'firebase/auth';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';

import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private authFire: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private http: HttpClient
  ) { }

  BASE_URL = environment.herokuUrl;

  // Registra un nuevo usuario en la base de datos
  registrarNuevoUsuario(nuevoUsuario: User, password: string) {

    return this.authFire.createUserWithEmailAndPassword(nuevoUsuario.email!, password)
      .then(() => {
        // SE HA REGISTRADO CORRECTAMENTE
        this.db.collection('usuarios').doc(nuevoUsuario.email).set(nuevoUsuario);
        this.login(nuevoUsuario.email!, password);

        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado',
          text: '¡Te has registrado correctamente!'
        });

      })
      .catch(err => {
        // Ha ocurrido un error
        Swal.fire({
          icon: 'error',
          title: 'El usuario ya existe',
          text: 'El correo electrónico que has introducido ya está registrado. Introduce un nuevo correo electrónico o prueba a iniciar sesión si ya tienes cuenta.'
        })
      });
  }

  // Obtenemos el usuario actual
  getCurrentUserRol(): string | null{
    return localStorage.getItem('currentUserRol');
  }

  // Valida el toquen del usuario y lo inserta en el localStorage
  validarToken() {
    const currentUser = this.authFire.currentUser;
    return currentUser.then(userCredential => {
      userCredential?.getIdToken().then(token => {
        if (token) {
          localStorage.setItem('tokenId', token);
        } else {
          localStorage.removeItem('tokenId');
        }
      })
    })
    .catch( err => {
      console.log("Error al validar token (Servicio):", err);
    })
  }

  // Loggea a un usuario en la plataforma
  login(email: string, password: string) {
    return this.authFire.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        userCredential.user?.getIdToken()
          .then(token => {
            // Actualizamos la BBDD de usuarios
            this.db.collection('usuarios').doc(email).update({
              'lastLogin': new Date(),
              'tokenId': token
            });

            localStorage.setItem('tokenId', token);

            // Obtenemos el usuario
            this.db.collection('usuarios').doc(email).get()
              .subscribe( resp => {
                const currentUser = resp.data() as User;
                localStorage.setItem('currentUserRol', currentUser.rol!);
                this.router.navigateByUrl('/dashboard');
              } );
            
          })
          .catch(err => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Se ha producido un error al intentar entrar en la plataforma. Inténtelo de nuevo más tarde.'
            });
          })
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Problema con el login',
          text: 'El usuario o contraseña introducido son incorrectos. Inténtelo de nuevo.'
        });
      });
  }

  // Deslogea a un usuario en la plataforma
  logout() {
    localStorage.removeItem('tokenId');

    this.authFire.signOut()
      .then(resp => {
        this.router.navigateByUrl('/login');
      });
  }

  // Hace el login con Google
  glogin() {
    return this.authFire.signInWithPopup(new GoogleAuthProvider())
      .then(userCredential => {

        userCredential.user?.getIdToken()
          .then(token => {

            localStorage.setItem('tokenId', token);
            this.router.navigateByUrl('/dashboard');

          })
          .catch(err => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Se ha producido un error al intentar entrar en la plataforma. Inténtelo de nuevo más tarde.'
            })
          })
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Problema con el login',
          text: 'El usuario o contraseña introducido son incorrectos. Inténtelo de nuevo.'
        });
      });
  }

  herokuLogin(user: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/login`, {
      user,
      password
    })
    .pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );  
  }

  herokuValidarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${this.BASE_URL}/auth/renew`, {headers: {'token': token}})
    .pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map(resp => true),
      catchError(err => of(false))
      
    );
  }

  herokuNewUser(name: string, password: string): Observable<any> { 
    return this.http.post(`${this.BASE_URL}/auth/new`, { name, password });
  }

}
