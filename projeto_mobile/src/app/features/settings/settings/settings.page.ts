import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { PreferencesService } from '../../../core/services/preferences.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage {
  private readonly preferencesService = inject(PreferencesService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);

  displayName = 'estudante';
  showCompleted = true;
  darkMode = false;

  async ionViewWillEnter(): Promise<void> {
    const preferences = await this.preferencesService.load();
    this.displayName = preferences.displayName;
    this.showCompleted = preferences.showCompleted;
    this.darkMode = preferences.darkMode;
  }

  async savePreferences(): Promise<void> {
    await this.preferencesService.save({
      displayName: this.displayName || 'estudante',
      showCompleted: this.showCompleted,
      darkMode: this.darkMode,
    });

    document.body.classList.toggle('dark', this.darkMode);
    await this.showToast('Preferencias salvas com sucesso.', 'success');
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  private async showToast(message: string, color: 'success' | 'warning'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });

    await toast.present();
  }
}
