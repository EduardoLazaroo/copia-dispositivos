import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonBadge,
  IonSpinner
} from '@ionic/angular/standalone';
import { DispositivoService } from '../../services/dispositivo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sensores',
  templateUrl: './sensores.page.html',
  styleUrls: ['./sensores.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonBadge,
    IonSpinner
  ]
})
export class SensoresPage implements OnInit, OnDestroy {
  latitude: number | null = null;
  longitude: number | null = null;
  carregandoGps: boolean = false;
  redeOnline: boolean = true;
  private subRede: Subscription = new Subscription();

  constructor(private dispositivoService: DispositivoService) { }

  ngOnInit() {
    // Inscreve-se no Observable de status de rede
    this.subRede = this.dispositivoService.redeConectada$.subscribe(online => {
      this.redeOnline = online;
    });
  }

  // Dispara a busca por coordenadas de GPS
  async capturarGps() {
    this.carregandoGps = true;
    const coords = await this.dispositivoService.obterCoordenadas();
    this.carregandoGps = false;

    if (coords) {
      this.latitude = coords.latitude;
      this.longitude = coords.longitude;
    }
  }

  ngOnDestroy() {
    this.subRede.unsubscribe();
  }
}
