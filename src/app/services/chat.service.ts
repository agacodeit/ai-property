import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../shared/models/chat/message';
import { lastValueFrom } from 'rxjs';
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

  get chat(): Array<Message> {
    return this.chatData;
  }

  constructor(private http: HttpClient) { }

  setChat(chatId: string) {

  }

  setThinking(value: boolean) {
    this.thinking = value;
  }

  async sendMessage(message: Message) {
    this.chatData.push(message);
    try {
      this.setThinking(true);
      const response = await lastValueFrom(this.http.post<{ answer: string }>(`${environment.url}/query/`, {
        query: message.text
      }));
      this.setThinking(false);
      const bot = new Message();
      bot.text = response.answer;
      bot.role = 'bot';
      this.chatData.push(bot);
    } catch (error) {

    }
  }

}
