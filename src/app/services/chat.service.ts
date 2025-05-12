import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Message } from '../shared/models/chat/message';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  thinking: boolean = false;
  private chatData: Array<Message> = [
    /* {
      chatId: '',
      read: true,
      sent: true,
      received: true,
      role: 'user',
      text: 'Olá, preciso de um apartamento em Lisboa'
    },
    {
      chatId: '',
      read: true,
      sent: true,
      received: true,
      role: 'bot',
      text: 'Boa tarde! Poderia me passar mais detalhes do que precisa?'
    },
    {
      chatId: '',
      read: true,
      sent: true,
      received: true,
      role: 'user',
      text: 'Encontre apartamentos à venda em Lisboa com 2 quartos e menos de 250.000€'
    },
    {
      chatId: '',
      read: true,
      sent: true,
      received: true,
      role: 'bot',
      text: 'Encontrei 1 imóvel que correspondem à sua busca:',
      content: {
        images: ['./assets/images/image1.jpg', './assets/images/image2.jpg', './assets/images/image3.jpg'],
        title: 'Apartamento T2 em Lisboa',
        price: 245000,
        currency: 'EUR',
        location: 'Lisboa, Avenidas Novas',
        beds: '2 quartos',
        description: 'Excelente apartamento T2 totalmente remodelado em zona central de Lisboa. Próximo de transportes e comércio. Boa exposição solar e vista desafogada.',
        varieties: ['Varanda', 'Cozinha equipada', 'Elevador']
      }
    } */
  ];

  get token() {
    const token = localStorage.getItem('tkn_ai_prt');
    if (token) return token;
    return '';
  }

  get chat(): Array<Message> {
    return this.chatData;
  }

  constructor(private http: HttpClient,
    private zone: NgZone
  ) { }

  setChat(chatId: string) {

  }

  setThinking(value: boolean) {
    this.thinking = value;
  }

  sendMessage(message: Message) {
    this.chatData.push(message);
    this.setThinking(true);
    const bot = new Message();
    bot.text = '';
    bot.role = 'bot';
    this.chatData.push(bot);
    this.streamChat(message.text).subscribe({
      next: (response) => {
        debugger
        const text = response.answer;
        this.chatData[this.chatData.length - 1].text += ` ${text}`;
      },
      error: () => {
        this.setThinking(false);
      },
      complete: () => {
        this.setThinking(false);
      },
    });
  }

  streamChat(message: string): Observable<any> {

    return new Observable((observer) => {
      fetch(`${environment.url}/secure/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ message }),
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
              const parsed = JSON.parse(chunk);
              this.zone.run(() => observer.next(parsed));
            } catch (e) {
              console.warn('Erro ao parsear chunk:', chunk);
            }

            readChunk(); // continue lendo
          });
        };

        readChunk();
      }).catch((error) => {
        this.zone.run(() => observer.error(error));
      });
    });
  }

}
