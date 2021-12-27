import { Component, Input, OnInit } from '@angular/core';
import { DatosPartido } from '../../interfaces/data.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-videos',
  templateUrl: './listado-videos.component.html',
  styleUrls: ['./listado-videos.component.css']
})
export class ListadoVideosComponent implements OnInit {

  displayedColumns: string[] = ['equipoLocal', 'equipoVisitante', 'fecha', 'acciones'];

  @Input() listadoPartidos!: DatosPartido[];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // console.log(event); 
    // console.log('EventFilter:', this.listadoPartidos);
    console.log(filterValue);
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  verDatosPartido(id: any) {
    console.log("Ver datos partido:", id);
    this.router.navigateByUrl(`/dashboard/videos/partido/${id}`);
  }
}
