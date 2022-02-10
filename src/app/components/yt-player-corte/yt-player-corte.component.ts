import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-yt-player-corte',
  templateUrl: './yt-player-corte.component.html',
  styles: ['.reproducir-de-nuevo { color: var(--color-ver-video); }']
})
export class YtPlayerCorteComponent implements OnChanges {

  @Input() height!: number;
  @Input() width!: number;
  @Input() videoId?: string;
  @Input() startSecond!: number;
  @Input() endSecond!: number;

  src!: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getPathEmbed();
  }


  verOtraVez() {
    this.getPathEmbed();
  }

  getPathEmbed() {
    const path: string = `https://www.youtube.com/embed/${this.videoId}?start=${this.startSecond}&end=${this.endSecond}&showinfo=0&controls=0`;
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(path); 
  }
}
