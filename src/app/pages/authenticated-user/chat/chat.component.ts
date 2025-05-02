import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  newMessage: string = '';

  messages: Array<any> = [
    {
      role: 'bot',
      text: '123'
    },
    {
      role: 'bot',
      text: '123'
    },
    {
      role: 'bot',
      text: '123'
    },
    {
      role: 'bot',
      text: '123'
    },{
      role: 'user',
      text: '123'
    },
    {
      role: 'user',
      text: '123'
    },{
      role: 'user',
      text: '123'
    },
    {
      role: 'user',
      text: '123'
    },{
      role: 'user',
      text: '123'
    },
    {
      role: 'user',
      text: '123'
    },{
      role: 'bot',
      text: '123'
    },
    {
      role: 'bot',
      text: '123'
    },{
      role: 'bot',
      text: '123'
    },
    {
      role: 'bot',
      text: '123'
    },{
      role: 'bot',
      text: '123'
    },
    {
      role: 'bot',
      text: '123'
    },{
      role: 'bot',
      text: '123'
    },
    {
      role: 'bot',
      text: '123'
    },{
      role: 'bot',
      text: '123'
    },
    {
      role: 'bot',
      text: '123'
    },
  ];

  sendMessage(){

  }
}
