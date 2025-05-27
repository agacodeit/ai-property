import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chat } from '../../shared/models/chat/chat';
import { Message } from '../../shared/models/chat/message';
import { MenuService } from '../menu/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '../../shared/models/api/api';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  thinking: boolean = false;
  private chatData: Chat | null = null;
  private chatSessionsData: Array<Chat> = [];

  get token() {
    const token = sessionStorage.getItem('tkn_ai_prt');
    if (token) return token;
    return '';
  }

  get chatSessions(): Array<Chat> {
    return this.chatSessionsData;
  }

  get chat(): Chat | null {
    return this.chatData;
  }

  constructor(private http: HttpClient,
    private menuService: MenuService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private zone: NgZone) { }

  async setChat(chatId: string): Promise<ApiResponse> {
    this.chatData = new Chat();
    this.chatData.id = chatId;
    try {
      const response = await lastValueFrom(this.http.get<any>(`${environment.url}/secure/chat/listChatMessages/${chatId}`));

      this.chatData.messages = response.map((r: any) => {
        let parsedContent: any = null;
        let isObject = false;
        if (typeof r.content === 'string' && (r.content.trim().startsWith('{') || r.content.trim().startsWith('['))) {
          try {
            parsedContent = JSON.parse(r.content);
            isObject = true;
          } catch (e) { }
        }
        return {
          text: !isObject ? r.content : 'Encontrei os imóveis abaixo:',
          role: r.role === 'assistant' ? 'bot' : 'user',
          content: parsedContent
        }
      });
      return { success: true, content: response };
    } catch (error: any) {
      return {
        success: false,
        error: error
      };
    }
  }

  setThinking(value: boolean) {
    this.thinking = value;
  }

  async sendMessage(message: Message) {
    if (!this.chatData) {
      this.chatData = new Chat();
      await this.router.navigate(['/auth/chat'], {
        relativeTo: this.activatedRoute,
        queryParams: { id: this.chatData.id },
        queryParamsHandling: 'merge'
      });
    };

    this.chatData.messages.push(message);
    message.chatId = this.chatData.id;

    this.setThinking(true);

    this.streamChat(this.chatData.id, message.text).subscribe({
      next: (response) => {
        let chatMessage = new Message();
        chatMessage.role = 'bot';
        chatMessage.text = response.answer || 'Encontrei esses imóveis disponíveis';
        chatMessage.content = response.content;
        chatMessage.chatId = this.chatData!.id;;

        this.chatData!.messages.push(chatMessage);

      },
      error: () => {
        this.setThinking(false);
        this.chatData!.messages[this.chatData!.messages.length - 1].text = 'Não consegui compreender...';
      },
      complete: () => {
        this.listChatSessions();
        this.setThinking(false);
      },
    });
  }

  startNewChat() {
    if (this.chat?.id && this.chat?.messages.length === 0) return;
    this.chatData = new Chat();
    this.router.navigate(['/auth/chat'], {
      queryParams: {
        id: this.chatData.id
      }
    })
    this.listChatSessions();
  }

  clearChat() {
    this.chatData = null;
    this.router.navigate(['/auth/chat']);
  }

  streamChat(chatId: string, message: string): Observable<any> {
    return new Observable((observer) => {
      fetch(`${environment.url}/secure/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ id: chatId, message }),
      }).then((response) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        const readChunk = () => {
          reader?.read().then(({ done, value }) => {
            if (done) {
              this.zone.run(() => observer.complete());
              return;
            }

            const chunk = decoder.decode(value, { stream: true });
            try {
              const mustSplit = chunk.indexOf('}{') >= 0;
              if (mustSplit) {
                const parts = chunk.split('}{');
                parts.forEach(c => {
                  const parsed = JSON.parse(`{${c.replace("{", "").replace("}", "")}}`);
                  this.zone.run(() => observer.next(parsed));
                });
              } else {
                const parsed = JSON.parse(chunk);
                this.zone.run(() => observer.next(parsed));
              }
            } catch (e) {
              console.warn('Erro ao parsear chunk:', chunk);
            }

            readChunk();
          });
        };

        readChunk();
      }).catch((error) => {
        this.zone.run(() => observer.error(error));
      });
    });
  }

  setChatSessions(chats: Array<Chat>) {
    this.menuService.setChatSessions(chats);
  }

  async listChatSessions() {
    try {
      const response = await lastValueFrom(this.http.get<Array<Chat>>(`${environment.url}/secure/chat/listUserChatSessions`));
      this.chatSessionsData = response;
      this.setChatSessions(response);
    } catch (error) { }
  }

  async removeChatSession(chatId: string): Promise<ApiResponse> {
    try {
      await lastValueFrom(this.http.delete(`${environment.url}/secure/chat/delete/${chatId}`));
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error
      }
    }
  }

  async editChatTitle(chatId: string, title: string): Promise<ApiResponse> {
    try {
      await lastValueFrom(this.http.put(`${environment.url}/secure/chat/update/title/${chatId}`, { title }));
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error
      }
    }
  }

}
