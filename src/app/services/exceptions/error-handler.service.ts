// error-handler.service.ts
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { ErrorMessagesService } from './error-message.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  constructor(
    private toastService: ToastService,
    private errorMessages: ErrorMessagesService
  ) { }

  handleError(error: any): void {
    let message = 'Erro desconhecido';

    if (error instanceof HttpErrorResponse) {
      const code = error.error?.message;
      message = this.errorMessages.getFriendlyMessage(code);
    } else if (error instanceof Error) {
      message = error.message;
    }

    this.toastService.show(message, 'error');
    console.error('Erro capturado:', error);
  }
}