import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class ChatComponent {

  newMessage: string = '';

  messages: Array<Message> = [
    {
      role: 'bot',
      text: '123'
    }
  ];

  sendMessage() {

  }
}
