import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../../services/chat/chat.service';
import { ErrorHandlerService } from '../../../services/exceptions/error-handler.service';
import { MenuService } from '../../../services/menu/menu.service';
import { ModalService } from '../../../services/modal/modal.service';
import { ToastService } from '../../../services/toast/toast.service';
import { fadeAnimation } from '../../../shared/animations/fade-animation';
import { MenuItem } from '../../../shared/models/menu';
import { CustomDatePipe } from "../../../shared/utils/customDate";
import { GeneralMessagesComponent } from '../../general-messages/general-messages.component';
import { OptionsComponent } from '../../options/options.component';
import { Option } from '../../../shared/models/components/option';

@Component({
  selector: 'app-menu-items',
  imports: [
    CommonModule,
    CustomDatePipe,
    OptionsComponent,
    FormsModule
  ],
  standalone: true,
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss',
  animations: [fadeAnimation]
})
export class MenuItemsComponent implements OnChanges {

  @ViewChildren('inputRef') inputElements!: QueryList<ElementRef>;
  @Input() chatSessions: any | null = null;

  editOptions: Option[] = [
    {
      id: 1,
      icon: 'fa-solid fa-pen-to-square',
      label: 'Editar'
    },
    {
      id: 2,
      icon: 'fa-solid fa-trash',
      label: 'Excluir',
      color: '#d54343'
    }
  ];

  editingChatValue: string = '';
  editingChat: string | null = null;
  showOptions: MenuItem | null = null;
  grouped: Array<{ date: Date; menuItems: MenuItem[] }> = [];


  get menuSelected() {
    return location.pathname;
  }

  get menu() {
    return this.menuService.menu;
  }

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
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
    const { id } = this.activatedRoute.snapshot.queryParams;
    if (id && id === menuItem.id) {
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
      this.editingChatValue = this.showOptions!.title || this.showOptions!.title;

      setTimeout(() => {
        const input = this.inputElements.find(
          (el) => el.nativeElement.getAttribute('data-id') === this.editingChat
        );
        input?.nativeElement.focus();
      });
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

  cancelEdition() {
    this.editingChat = null;
  }

  async confirmEdition(menuItem: MenuItem) {
    const response = await this.chatService.editChatTitle(menuItem.id, this.editingChatValue);
    if (response.error) this.errorHandlerService.handleError(response.error);
    else {
      menuItem.title = this.editingChatValue;
      this.editingChatValue = '';
      this.editingChat = null;
      this.toastService.show('Título editado com sucesso!', 'success');
    }
  }

}
