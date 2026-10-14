import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({ providedIn: 'root' })
export class NativeService {
  async takePhotoBase64(): Promise<string | null> {
    try {
      // Captura direta da camera para vincular na tarefa.
      const photo = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64,
      });

      return photo.base64String ? `data:image/jpeg;base64,${photo.base64String}` : null;
    } catch {
      // Em navegador ou sem permissao, retorna nulo sem quebrar a tela.
      return null;
    }
  }

  async getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
    try {
      // Solicita permissao antes de tentar acessar GPS.
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== 'granted') {
        return null;
      }

      const coords = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      return { lat: coords.coords.latitude, lng: coords.coords.longitude };
    } catch {
      return null;
    }
  }

  async scheduleReminder(title: string, body: string): Promise<boolean> {
    return this.scheduleReminderAt(title, body, new Date(Date.now() + 3000));
  }

  async scheduleReminderAt(title: string, body: string, at: Date): Promise<boolean> {
    try {
      // Notificacao local depende de permissao explicita do sistema.
      const permissions = await LocalNotifications.requestPermissions();
      if (permissions.display !== 'granted') {
        return false;
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now(),
            title,
            body,
            schedule: { at },
          },
        ],
      });

      return true;
    } catch {
      return false;
    }
  }
}
