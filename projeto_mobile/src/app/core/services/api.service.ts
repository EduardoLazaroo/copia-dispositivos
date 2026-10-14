import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TodoApiItem {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  getExternalTodos(): Observable<TodoApiItem[]> {
    // Endpoint publico usado nas aulas de consumo REST.
    return this.http.get<TodoApiItem[]>(`${this.baseUrl}/todos?_limit=10`);
  }
}
