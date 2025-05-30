// toast.service.ts
import { Injectable } from '@angular/core';
import { ToastComponent } from '../../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastComponent!: ToastComponent;

  register(toastComponent: ToastComponent) {
    this.toastComponent = toastComponent;
  }

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', timer?: number) {
    this.toastComponent?.showToast(message, type, timer);
  }

  clear() {
    this.toastComponent.toasts.shift();
  }
}
