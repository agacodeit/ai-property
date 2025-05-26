import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ChatService } from '../../../services/chat/chat.service';
import { ToastService } from '../../../services/toast/toast.service';

export const chatGuardGuard: CanActivateFn = async (route, state) => {
  const toastService = inject(ToastService);
  const chatService = inject(ChatService);
  const router = inject(Router)

  const { id } = route.queryParams;

  if (id) {
    const response = await chatService.setChat(id);

    if (response.success && response.content && response.content.length === 0) {
      toastService.show(`Erro ao carregar informações do chat ${id}`, 'error');
      chatService.clearChat();
      router.navigate(['/auth/chat']);
    }
  }

  return true;
};
