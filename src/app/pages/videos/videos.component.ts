import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['../pages.component.css']
})
export class VideosComponent implements OnInit {



  constructor(
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  registrarPartido(): void {
    this.router.navigateByUrl('/dashboard/videos/registrar-nuevo-partido');
  }

}
