import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../../../shared/models/menu';
import { CustomDatePipe } from "../../../shared/utils/customDate";
import { MenuService } from '../../../services/menu/menu.service';

@Component({
  selector: 'app-menu-items',
  imports: [
    CommonModule,
    CustomDatePipe
  ],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss'
})
export class MenuItemsComponent {

  hoveredMenuItem: MenuItem | null = null;
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
      // Procura grupo existente para essa data (comparando só ano, mes, dia)
      const group = grouped.find(g =>
        g.date.getFullYear() === dateOnly.getFullYear() &&
        g.date.getMonth() === dateOnly.getMonth() &&
        g.date.getDate() === dateOnly.getDate()
      );

      if (group) {
        group.menuItems.push(item); // Adiciona no grupo existente
      } else {
        grouped.push({
          date: dateOnly,
          menuItems: [item],
        });
      }

      return prev; // Não precisamos acumular valor, só iterar
    }, null);

    return grouped;
  }



  constructor(private router: Router,
    private menuService: MenuService
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


}
