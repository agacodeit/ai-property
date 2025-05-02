import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { MenuItem } from '../../../shared/models/menu';
import { ThemeService } from '../../../services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-items',
  imports: [
    CommonModule
  ],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss'
})
export class MenuItemsComponent {

  get menu(){
    return this.menuService.menu;
  }

  hoveredMenuItem: MenuItem | null = null;
  activeMenuItem: MenuItem | null = null;

  get menuSelected() {
    return location.pathname;
  }

  constructor(private router: Router,
    private menuService: MenuService
  ) { }

  ngOnChanges() {

  }

  navigate(item: MenuItem, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    const currentUrl = this.router.url;

    if (currentUrl === item.route) {
      return;
    }
    this.router.navigate([item.route]);
  }

  currentMenuSelected(menuItem: MenuItem) {
    if (location.pathname.includes(menuItem.route)) {
      return true;
    }
    return false;
  }

}
