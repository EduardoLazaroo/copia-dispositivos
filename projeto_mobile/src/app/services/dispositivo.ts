import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Network, ConnectionStatus } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {
  // Estado reativo do status de rede (Online/Offline)
  private redeSubject = new BehaviorSubject<boolean>(true);
  public redeConectada$: Observable<boolean> = this.redeSubject.asObservable();

  constructor() {
    this.iniciarMonitoramentoRede();
  }

  // Captura as coordenadas atuais de latitude e longitude do dispositivo
  async obterCoordenadas(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const posicao: Position = await Geolocation.getCurrentPosition();
      return {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude
      };
    } catch (erro) {
      console.warn('Erro ao obter posição de GPS:', erro);
      return null;
    }
  }

  // Monitora alterações de conexão de rede em tempo real com ouvintes (Listeners)
  private async iniciarMonitoramentoRede() {
    const status: ConnectionStatus = await Network.getStatus();
    this.redeSubject.next(status.connected);

    // Registra o ouvinte para disparar novidades sempre que o estado da rede alterar
    Network.addListener('networkStatusChange', (novoStatus) => {
      this.redeSubject.next(novoStatus.connected);
    });
  }
}
