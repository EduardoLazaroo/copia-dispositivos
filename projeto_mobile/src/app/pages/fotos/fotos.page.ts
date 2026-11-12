import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonCard,
  IonImg
} from '@ionic/angular/standalone';
import { FotoService } from '../../services/foto';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonCard,
    IonImg
  ]
})
export class FotosPage implements OnInit {
  fotoUrl: string | undefined = '';

  constructor(private fotoService: FotoService) { }

  ngOnInit() { }

  async tirarFoto() {
    const url = await this.fotoService.tirarFoto();
    if (url) {
      this.fotoUrl = url;
    }
  }

  async abrirGaleria() {
    const url = await this.fotoService.selecionarDaGaleria();
    if (url) {
      this.fotoUrl = url;
    }
  }
}
