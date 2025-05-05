import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../../../shared/models/chat/message';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  newMessage: string = '';

  messages: Array<Message> = [
    {
      role: 'user',
      text: 'Olá, preciso de um apartamento em Lisboa'
    },
    {
      role: 'bot',
      text: 'Boa tarde! Poderia me passar mais detalhes do que precisa?'
    },
    {
      role: 'user',
      text: 'Encontre apartamentos à venda em Lisboa com 2 quartos e menos de 250.000€'
    },
    {
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
    }
  ];

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    const container = this.messagesContainer.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const newMessage = new Message();
    newMessage.text = this.newMessage;
    newMessage.role = 'user';
    this.messages.push(newMessage);
    this.newMessage = '';
    const newBotMessage = new Message();
    newBotMessage.text = 'Desculpe, não consegui entender o que você quis dizer.';
    newBotMessage.role = 'bot';
    this.messages.push(newBotMessage);
  }
}
