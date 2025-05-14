import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MyAdvertisementsComponent } from '../../pages/authenticated-user/my-advertisements/my-advertisements.component';
import { MenuService } from '../../services/menu/menu.service';
import { ModalService } from '../../services/modal/modal.service';
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

  get menu() {
    return this.menuService.menu;
  }

  constructor(private menuService: MenuService,
    private modalService: ModalService
  ) { }

  openMyAdvertisements() {
    this.modalService.open(MyAdvertisementsComponent, {
      title: 'Meus anúncios',
      icon: 'fa-solid fa-arrow-trend-up',
      fullscreen: true
    })
  }

}
