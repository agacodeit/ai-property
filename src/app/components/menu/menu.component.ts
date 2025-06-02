import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
export class MenuComponent implements OnInit {
  @ViewChild('menuContainer', { static: true }) menuContainer!: ElementRef;

  isResizing = false;
  lastDownX = 0;
  minWidth = 200;
  maxWidth = 600;

  get menu() {
    return this.menuService.menu;
  }

  get menuState() {
    return this.menuService.menu.state.value;
  }

  get chatSessions() {
    return this.chatService.chatSessions;
  }

  constructor(private menuService: MenuService,
    private modalService: ModalService,
    private chatService: ChatService) {
    this.chatService.listChatSessions();
  }

  ngOnInit() {
    const savedWidth = localStorage.getItem('menuWidth');
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= this.minWidth && width <= this.maxWidth) {
        this.menuContainer.nativeElement.style.width = `${width}px`;
        this.menuContainer.nativeElement.style.maxWidth = `${width}px`;
        this.menuContainer.nativeElement.style.minWidth = `${width}px`;
      }
    }
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

  // 🔥 Resize handlers
  onResizeStart(event: MouseEvent) {
    this.isResizing = true;
    this.lastDownX = event.clientX;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onResize(event: MouseEvent) {
    if (!this.isResizing) {
      return;
    }

    const dx = event.clientX - this.lastDownX;
    const currentWidth = this.menuContainer.nativeElement.offsetWidth;
    let newWidth = currentWidth + dx;

    if (newWidth < this.minWidth) newWidth = this.minWidth;
    if (newWidth > this.maxWidth) newWidth = this.maxWidth;

    this.menuContainer.nativeElement.style.width = `${newWidth}px`;
    this.menuContainer.nativeElement.style.maxWidth = `${newWidth}px`;
    this.menuContainer.nativeElement.style.minWidth = `${newWidth}px`;

    this.lastDownX = event.clientX;
  }

  @HostListener('document:mouseup')
  onResizeEnd() {
    if (this.isResizing) {
      const width = this.menuContainer.nativeElement.offsetWidth;
      localStorage.setItem('menuWidth', width.toString());
    }
    this.isResizing = false;
  }


}
