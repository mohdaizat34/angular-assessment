import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://test-demo.aemenersol.com/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const data = { username, password };
    return this.http.post<any>(`${this.apiUrl}/account/login`, data);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getDashboardData(): Observable<any> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/dashboard`, { headers });
  }
}
