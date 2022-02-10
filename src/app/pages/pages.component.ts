import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { SidebarService } from '../services/sidebar.service';
import { AuthService } from '../services/auth.service';
import { ItemSidebar } from '../interfaces/sidebar.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { ROLE_ADMIN } from '../interfaces/auth.interface';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, OnDestroy {

  mobileQuery!: MediaQueryList;
  _mobileQueryListener!: () => void;

  vItemsSidebar: ItemSidebar[] = this.sidebarService.getVItemsSidebar();
  currentUser?: Usuario;

  events: string[] = [];
  opened: boolean = false;

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) { 
    this.mobileQuery = media.matchMedia('(max-width: 956px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("resize", this._mobileQueryListener);
  }

  ngOnInit(): void { 
    this.authService.herokuRenew().subscribe(
      resp => {
        this.currentUser = resp.user;
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("resize", this._mobileQueryListener);
  }

  getClass(itemSidebar: ItemSidebar) {
    return 'fas ' + itemSidebar.iconPath;
  }

  mostrarOpcion(item: ItemSidebar) {
    return (this.currentUser) ?
      (!item.adminOption) || (item.adminOption && this.currentUser.role?.includes(ROLE_ADMIN)) :
      false;
  }

  cerrarSidebar(drawer: any) {
    drawer.toggle();
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
