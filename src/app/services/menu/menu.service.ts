import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Menu, MenuItem } from '../../shared/models/menu';
import { Chat } from '../../shared/models/chat/chat';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuData: Menu = {
    state: new BehaviorSubject<boolean>(true),
    menuItems: []
  };

  private submenuData: MenuItem | undefined;

  get menu() {
    return this.menuData;
  }

  get submenu() {
    return this.submenuData;
  }

  constructor() {
    const that = this;
    document.onkeyup = function (evt: any) {
      evt = evt || window.event;
      if (evt.keyCode == 27 && that.menuData.state.value === true) {
        //that.setMenuState(false);
      }
    };
  }

  setMenuState(state: boolean) {
    this.menuData.state.next(state);
  }

  setSubmenu(menuItem: MenuItem) {
    this.submenuData = menuItem;
  }

  setChatSessions(chats: Array<Chat>) {
    this.menuData.menuItems = chats.map((c: Chat) => {
      return {
        label: c.id,
        route: '/auth/chat',
        dateHourIncluded: moment.utc(c.updatedAt).valueOf(),
        id: c.id,
        title: c.title
      }
    }).sort(
      (a, b) => new Date(b.dateHourIncluded).getTime() - new Date(a.dateHourIncluded).getTime()
    )
  }

}
