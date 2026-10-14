import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class LocalDatabaseService {
  private readonly ionicStorage = inject(Storage);

  private storage?: Storage;

  async ready(): Promise<void> {
    if (this.storage) {
      return;
    }

    // Cria a instancia real de armazenamento na primeira chamada.
    this.storage = await this.ionicStorage.create();
  }

  async set<T>(key: string, value: T): Promise<void> {
    // Salva objetos tipados para uso offline/local.
    await this.ready();
    await this.storage?.set(key, value);
  }

  async get<T>(key: string): Promise<T | null> {
    await this.ready();
    const value = await this.storage?.get(key);
    return (value ?? null) as T | null;
  }

  async remove(key: string): Promise<void> {
    await this.ready();
    await this.storage?.remove(key);
  }
}
