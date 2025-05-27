import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MyAdvertisementsComponent } from '../../pages/authenticated-user/my-advertisements/my-advertisements.component';
import { MenuService } from '../../services/menu/menu.service';
import { ModalService } from '../../services/modal/modal.service';
import { MenuItemsComponent } from './menu-items/menu-items.component';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    MenuItemsComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  get menu() {
    return this.menuService.menu;
  }

  get menuState() {
    return this.menuService.menu.state.value;
  }

  get chatSessions(){
    return this.chatService.chatSessions;
  }

  constructor(private menuService: MenuService,
    private modalService: ModalService,
    private chatService: ChatService) {
    this.chatService.listChatSessions();
  }

  openMyAdvertisements() {
    this.modalService.open(MyAdvertisementsComponent, {
      title: 'Meus anúncios',
      icon: 'fa-solid fa-arrow-trend-up',
      fullscreen: true
    })
  }

  toggleMenu() {
    this.menuService.setMenuState(!this.menu.state);
  }

  startNewChat() {
    this.chatService.startNewChat();
  }

}
