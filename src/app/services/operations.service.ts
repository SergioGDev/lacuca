import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor() { }

  /* Dada una URL, devuelve el ID del video de YouTube asociado */ 
  getYouTubeID (url: string) {
    const s1: string = 'https://www.youtube.com/watch?v=';
    const s2: string = 'www.youtube.com/watch?v=';
    const s3: string = 'youtube.com/watch?v=';
    const s4: string = 'https://www.youtube.com/embed/';

    if (url.startsWith(s1) || url.startsWith(s2) || url.startsWith(s3)) {
      return url.split(s3)[1].split('&')[0];

    } else if (url.startsWith(s4)) {
      // Proviene de una URL de IFRAME
      return url.split(s4)[1]
    } else {
      return '';
    }
  }
}
