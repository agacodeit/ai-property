import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResult } from '../../shared/models/auth/auth';
import { User } from '../../shared/models/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loggedUserData: User | null = null;

  get loggedUser() {
    return this.loggedUserData;
  }

  constructor(private http: HttpClient) { }

  async authenticate(credentials: { username: string, password: string }): Promise<AuthResult> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ token: string }>(`${environment.url}/auth/login`, credentials)
      );
      this.setToken(response.token);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error
      };
    }
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
