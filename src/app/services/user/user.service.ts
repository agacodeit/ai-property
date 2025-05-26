import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResult } from '../../shared/models/auth/auth';
import { User } from '../../shared/models/user/user';
import { ChatService } from '../chat/chat.service';
import { ApiResponse } from '../../shared/models/api/api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loggedUserData: User | null = null;

  get loggedUser() {
    return this.loggedUserData;
  }

  constructor(private http: HttpClient,
    private chatService: ChatService
  ) { }

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

  async getLoggedUser(): Promise<ApiResponse> {
    try {
      const response = await lastValueFrom(this.http.get<User>(`${environment.url}/secure/user/loggedUser`));
      return {
        success: true,
        content: response
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  setLoggedUser(user: User) {
    this.loggedUserData = user;
  }

  setToken(accessToken: string) {
    sessionStorage.setItem('tkn_ai_prt', accessToken);
  }

  logout() {
    this.loggedUserData = null;
    sessionStorage.removeItem('tkn_ai_prt');
    this.chatService.clearChat();
  }

}
