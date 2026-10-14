import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface UserPreferences {
  displayName: string;
  showCompleted: boolean;
  darkMode: boolean;
}

const PREFS_KEY = 'pm_user_preferences';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly localDarkModeKey = 'pm_dark_mode';
  private readonly localShowCompletedKey = 'pm_show_completed';

  async load(): Promise<UserPreferences> {
    // Preferences guarda objeto principal entre sessoes.
    const { value } = await Preferences.get({ key: PREFS_KEY });

    let fromPreferences: Partial<UserPreferences> = {};
    if (value) {
      try {
        fromPreferences = JSON.parse(value) as UserPreferences;
      } catch {
        fromPreferences = {};
      }
    }

    // localStorage mantem flags simples para leitura rapida de UI.
    const darkModeRaw = localStorage.getItem(this.localDarkModeKey);
    const showCompletedRaw = localStorage.getItem(this.localShowCompletedKey);

    return {
      displayName: fromPreferences.displayName ?? 'estudante',
      darkMode: darkModeRaw ? darkModeRaw === 'true' : (fromPreferences.darkMode ?? false),
      showCompleted: showCompletedRaw ? showCompletedRaw === 'true' : (fromPreferences.showCompleted ?? true),
    };
  }

  async save(preferences: UserPreferences): Promise<void> {
    // Salva no plugin e espelha flags no navegador.
    await Preferences.set({ key: PREFS_KEY, value: JSON.stringify(preferences) });
    localStorage.setItem(this.localDarkModeKey, String(preferences.darkMode));
    localStorage.setItem(this.localShowCompletedKey, String(preferences.showCompleted));
  }
}
