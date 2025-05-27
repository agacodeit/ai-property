import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../../services/menu/menu.service';
import { fadeAnimation } from '../../../shared/animations/fade-animation';
import { MenuItem } from '../../../shared/models/menu';
import { CustomDatePipe } from "../../../shared/utils/customDate";
import { ModalService } from '../../../services/modal/modal.service';
import { GeneralMessagesComponent } from '../../general-messages/general-messages.component';
import { ChatService } from '../../../services/chat/chat.service';
import { ErrorHandlerService } from '../../../services/exceptions/error-handler.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-menu-items',
  imports: [
    CommonModule,
    CustomDatePipe
  ],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss',
  animations: [fadeAnimation]
})
export class MenuItemsComponent {

  showIcons: string | null = null;
  activeMenuItem: MenuItem | null = null;

  get menu() {
    return this.menuService.menu;
  }

  get menuSelected() {
    return location.pathname;
  }

  get groupedMenu(): Array<{ date: Date; menuItems: MenuItem[] }> {
    const items = this.menu.menuItems;
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

    return grouped;
  }

  constructor(private router: Router,
    private menuService: MenuService,
    private modalService: ModalService,
    private chatService: ChatService,
    private errorHandlerService: ErrorHandlerService,
    private toastService: ToastService
  ) { }

  ngOnChanges() {

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

  sameDate(index: number) {
    if (index === 0) return false;

    const previousDate = new Date(this.menu.menuItems[index - 1].dateHourIncluded);
    const currentDate = new Date(this.menu.menuItems[index].dateHourIncluded);

    const same = previousDate.getDate() === currentDate.getDate() &&
      previousDate.getMonth() === currentDate.getMonth() &&
      previousDate.getFullYear() === currentDate.getFullYear();
    return same;
  }

  editMenuItem(menuItem: MenuItem) {
    debugger
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

}
