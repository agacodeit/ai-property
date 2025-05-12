import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../shared/models/user/user';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loggedUserData: User | null = null;

  get loggedUser() {
    return this.loggedUserData;
  }

  constructor(private http: HttpClient) { }

  async authenticate(credentials: { username: string, password: string }) {
    try {
      const response = await lastValueFrom(this.http.post<{ token: string }>(`${environment.url}/auth/login`, credentials));
      this.setToken(response.token);
      return true;
    } catch (error) { return false }
  }

  setLoggedUser(user: User) {

  }

  setToken(accessToken: string) {
    localStorage.setItem('tkn_ai_prt', accessToken);
  }

  logout() {
    this.loggedUserData = null;
    localStorage.removeItem('tkn_ai_prt');
  }

}
