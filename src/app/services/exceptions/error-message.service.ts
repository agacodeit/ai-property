// error-messages.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorMessagesService {
  private readonly messages: Record<string, string> = {
    'login.invalidcredentials': 'Credenciais inválidas',
    'user.notfound': 'Usuário não encontrado'
  };

  getFriendlyMessage(code: string): string {
    return this.messages[code] || 'Ocorreu um erro inesperado.';
  }
}