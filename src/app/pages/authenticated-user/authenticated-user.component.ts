import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { ThemeService } from '../../services/theme.service';
import { MenuComponent } from '../../components/menu/menu.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-authenticated-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    MenuComponent,
    HeaderComponent
  ],
  templateUrl: './authenticated-user.component.html',
  styleUrl: './authenticated-user.component.scss'
})
export class AuthenticatedUserComponent {

  get darkMode() {
    return this.themeService.darkMode;
  }

  get menuState() {
    return this.menuService.menu.state.value;
  }

  constructor(private menuService: MenuService,
    private themeService: ThemeService
  ) {
    this.menuService.setSubmenu(this.menuService.menu.menuItems[0]);
  }

  openMenu() {
    this.menuService.setMenuState(!this.menuService.menu.state.value);
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

}
