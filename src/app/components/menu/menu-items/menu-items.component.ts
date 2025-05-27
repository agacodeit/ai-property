import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../../services/menu/menu.service';
import { fadeAnimation } from '../../../shared/animations/fade-animation';
import { Menu, MenuItem } from '../../../shared/models/menu';
import { CustomDatePipe } from "../../../shared/utils/customDate";
import { ModalService } from '../../../services/modal/modal.service';
import { GeneralMessagesComponent } from '../../general-messages/general-messages.component';
import { ChatService } from '../../../services/chat/chat.service';
import { ErrorHandlerService } from '../../../services/exceptions/error-handler.service';
import { ToastService } from '../../../services/toast/toast.service';
import { FormsModule, NgModel } from '@angular/forms';
import { OptionsComponent } from '../../options/options.component';

@Component({
  selector: 'app-menu-items',
  imports: [
    CommonModule,
    CustomDatePipe,
    OptionsComponent
  ],
  standalone: true,
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss',
  animations: [fadeAnimation]
})
export class MenuItemsComponent implements OnChanges {

  editingChat: string | null = null;
  showOptions: MenuItem | null = null;
  activeMenuItem: MenuItem | null = null;
  grouped: Array<{ date: Date; menuItems: MenuItem[] }> = [];

  @Input() chatSessions: any | null = null;

  get menuSelected() {
    return location.pathname;
  }

  get menu() {
    return this.menuService.menu;
  }

  constructor(private router: Router,
    private menuService: MenuService,
    private modalService: ModalService,
    private chatService: ChatService,
    private errorHandlerService: ErrorHandlerService,
    private toastService: ToastService
  ) { }

  ngOnChanges(): void {
    this.updateGroupedItems();
  }

  navigate(item: MenuItem) {
    this.router.navigate([item.route], {
      queryParams: {
        id: item.id
      }
    });
  }

  currentMenuSelected(menuItem: MenuItem) {
    if (location.pathname.includes(menuItem.route)) {
      return true;
    }
    return false;
  }

  openOptions(menuItem: MenuItem) {
    this.showOptions = menuItem;
  }

  deleteMenuItem(menuItem: MenuItem) {
    this.modalService.open(GeneralMessagesComponent, {
      title: 'Remover conversa',
      icon: 'fa-brands fa-rocketchat',
      content: {
        message: 'Deseja realmente remover esta conversa?',
        btns: [
          {
            class: 'secondary-btn',
            label: 'Cancelar',
            value: false
          },
          {
            class: 'primary-btn',
            label: 'Confirmar',
            value: true
          }
        ]
      }
    })?.subscribe(async (confirm: boolean) => {
      if (confirm) {
        const response = await this.chatService.removeChatSession(menuItem.id);
        if (response.error) this.errorHandlerService.handleError(response.error);
        else {
          this.toastService.show('Anúncio removido com sucesso!', 'success');
        }
      }
      this.chatService.listChatSessions();
      if (menuItem.id === this.chatService.chat?.id) {
        this.chatService.clearChat();
      }
    });
  }

  triggerAction(action: number) {
    if (action === 1) {
      this.editingChat = this.showOptions!.id;
    } else if (action === 2) {
      this.deleteMenuItem(this.showOptions!)
    }
    this.showOptions = null;
  }

  updateGroupedItems() {
    const items = this.menu?.menuItems || [];
    const grouped: Array<{ date: Date; menuItems: MenuItem[] }> = [];

    items.reduce((prev, item) => {
      const itemDate = new Date(item.dateHourIncluded);
      const dateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
      const group = grouped.find(g =>
        g.date.getFullYear() === dateOnly.getFullYear() &&
        g.date.getMonth() === dateOnly.getMonth() &&
        g.date.getDate() === dateOnly.getDate()
      );

      if (group) {
        group.menuItems.push(item);
      } else {
        grouped.push({
          date: dateOnly,
          menuItems: [item],
        });
      }

      return prev;
    }, null);

    this.grouped = grouped;
  }

}
