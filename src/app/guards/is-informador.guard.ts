import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import Swal from "sweetalert2";
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';
import { Observable, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsInformadorGuard implements CanActivate, CanLoad {
  constructor( 
    private router: Router,
    private authService: AuthService ) { }

    canActivate(): Observable<boolean> |  boolean {
      return this.authService.herokuValidarIsInformador()
              .pipe(
                tap(valid => {
                  if(!valid){
                    this.router.navigate(['/login']);
                  }
                })
              );
    }

    canLoad(): Observable<boolean> | boolean {
      return this.authService.herokuValidarIsInformador()
              .pipe(
                tap(valid => {
                  if(!valid){
                    this.router.navigate(['/login']);
                  }
                })
              );
    }
}
