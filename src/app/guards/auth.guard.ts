import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import Swal from "sweetalert2";
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor( 
        private router: Router,
        private authService: AuthService ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        return this.authService.validarToken()
            .then( () => {
                const token = localStorage.getItem('tokenId') || '';
                if (token === '') {
                    this.router.navigateByUrl('/login');
                }
                return true;
            })
            .catch( () => {
                this.router.navigateByUrl('/login');
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el servidor',
                    text: 'Ha ocurrido un error al autenticar al usuario.'
                })
                return false;
            })
        
        return true;
    }

}