import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environments';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getProfessionals(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/professionals`);
  }

  getProfessionalById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/professionals/${id}`);
  }

  getAvailability(professionalId: number, date: string): Observable<{ available_times: string[] }> {
    // Usamos HttpParams para adicionar a data como um query parameter de forma segura
    const params = new HttpParams().set('date', date);
    return this.http.get<{ available_times: string[] }>(
      `${this.apiUrl}/professionals/${professionalId}/availability`,
      {params}
    );
  }
}
