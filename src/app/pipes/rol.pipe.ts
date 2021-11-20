import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rol'
})
export class RolPipe implements PipeTransform {

  transform(value: string | undefined): string {
    switch(value) {
      case 'user':      return "Usuario";
      case 'admin':     return "Administrador";
      case 'designer':  return "Diseñador";
      default:          return "Sin rol definido";
    }
  }

}
