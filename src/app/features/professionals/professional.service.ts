import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environments';
import {HttpClient} from '@angular/common/http';
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
}
