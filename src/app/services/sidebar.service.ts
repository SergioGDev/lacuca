import { Injectable } from '@angular/core';
import { ItemSidebar } from '../interfaces/sidebar.interface';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  vItemsSidebar: ItemSidebar[] = [
    { nombre: 'Inicio', path: '/dashboard/inicio', iconPath: 'fa-home' },
    { nombre: 'Zona tests', path: '/dashboard/tests', iconPath: 'fa-pen-alt' },
    { nombre: 'Jugadas', path: '/dashboard/jugadas', iconPath: 'fa-video' },
    { nombre: 'Designaciones', path: '/dashboard/designaciones', iconPath: 'fa-basketball-ball' },
    { nombre: 'Usuarios', path: '/dashboard/listado-usuarios', iconPath: 'fa-user', adminOption: true },
  ]

  constructor() { }

  getVItemsSidebar(): ItemSidebar[] {
    return this.vItemsSidebar;
  }

}
