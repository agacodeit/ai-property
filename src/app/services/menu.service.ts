import { Injectable } from '@angular/core';
import { Menu, MenuItem } from '../shared/models/menu';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuData: Menu = {
    state: new BehaviorSubject<boolean>(true),
    menuItems: [
      {
        label: 'Busca por apartamentos para compra',
        route: '/auth/chat'
      }
    ]
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

}
