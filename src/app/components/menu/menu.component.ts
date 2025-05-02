import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { MenuItemsComponent } from './menu-items/menu-items.component';

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

  /* @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.menuService.setMenuState(false);
    }
  } */

  get menu() {
    return this.menuService.menu;
  }

  constructor(private menuService: MenuService) { }

}
