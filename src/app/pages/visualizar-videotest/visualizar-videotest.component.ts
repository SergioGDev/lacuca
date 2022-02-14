import { Component, OnInit } from '@angular/core';
import { InterdataService } from '../../services/interdata.service';
import { VideotestService } from '../../services/videotest.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-visualizar-videotest',
  templateUrl: './visualizar-videotest.component.html',
  styleUrls: ['./visualizar-videotest.component.css']
})
export class VisualizarVideotestComponent implements OnInit {

  constructor(
    private interdataService: InterdataService,
    private videotestService: VideotestService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const idVideotest = this.interdataService.getIdVideotestFromCache();

    if (idVideotest) {
      
      this.videotestService.obtenerDatosVideotest(idVideotest)
        //.subscribe(resp => console.log(resp));
    } else {
      this.router.navigateByUrl('/dashboard/zona-tests/admin-videotest');
    }
  }

}
