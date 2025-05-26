// toast.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { Router } from '@angular/router';

interface Toast {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timer?: number;
    progress?: number;
    intervalId?: any;
}


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
    toasts: Toast[] = [];

    constructor(private modalService: ModalService,
        private router: Router
    ) {

    }

    showToast(
        message: string,
        type: 'success' | 'error' | 'info' | 'warning' = 'info',
        timer?: number
    ) {
        this.toasts = [];

        const toast: Toast = { message, type, timer, progress: 100 };
        this.toasts.push(toast);

        if (timer) {
            const start = Date.now();

            toast.intervalId = setInterval(() => {
                const elapsed = Date.now() - start;
                toast.progress = Math.max(0, 100 - (elapsed / timer) * 100);

                if (toast.progress === 0) {

                    this.modalService.close();
                    this.router.navigate(['/']);

                    this.removeToast(toast);
                }
            }, 50);
        } else {
            setTimeout(() => {
                this.toasts.shift();
            }, 5000);
        }
    }

    private removeToast(toast: Toast) {
        clearInterval(toast.intervalId);
        this.toasts = this.toasts.filter(t => t !== toast);
    }

    clear() {
        this.toasts = [];
    }
}  