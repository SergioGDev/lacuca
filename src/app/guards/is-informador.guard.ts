import { Injectable } from "@angular/core";
import { CanActivate, CanLoad, Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
