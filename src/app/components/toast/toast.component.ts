// toast.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
    toasts: { message: string, type: string }[] = [];

    showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
        this.toasts.push({ message, type });

        setTimeout(() => {
            this.toasts.shift();
        }, 3000);
    }
}
