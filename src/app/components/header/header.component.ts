import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  get darkMode() {
    return this.themeService.darkMode;
  }

  constructor(private menuService: MenuService,
    private themeService: ThemeService
  ) {

  }

  openMenu() {
    this.menuService.setMenuState(true);
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

}
