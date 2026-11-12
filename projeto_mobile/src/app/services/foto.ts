import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  constructor() { }

  // Captura uma foto utilizando a câmera física ou webcam
  async tirarFoto(): Promise<string | undefined> {
    try {
      const imagemCapturada = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // Retorna uma URL acessível pela WebView
        source: CameraSource.Camera, // Aciona a câmera
        quality: 90 // Qualidade da imagem (0 a 100)
      });

      return imagemCapturada.webPath;
    } catch (erro) {
      console.warn('Captura de foto cancelada ou não suportada:', erro);
      return undefined;
    }
  }

  // Seleciona uma imagem existente da galeria de fotos do dispositivo
  async selecionarDaGaleria(): Promise<string | undefined> {
    try {
      const imagemSelecionada = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos, // Abre a galeria de fotos
        quality: 90
      });

      return imagemSelecionada.webPath;
    } catch (erro) {
      console.warn('Seleção de galeria cancelada:', erro);
      return undefined;
    }
  }
}