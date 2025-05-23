import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MenuService } from '../../services/menu/menu.service';
import { ThemeService } from '../../services/theme/theme.service';
import { MenuComponent } from '../../components/menu/menu.component';
import { menuAnimation } from '../../shared/animations/menu-animations';

@Component({
  selector: 'app-authenticated-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    MenuComponent
  ],
  templateUrl: './authenticated-user.component.html',
  styleUrl: './authenticated-user.component.scss',
  animations: [menuAnimation]
})
export class AuthenticatedUserComponent {

  get darkMode() {
    return this.themeService.darkMode;
  }

  get menuState() {
    return this.menuService.menu.state;
  }

  constructor(private menuService: MenuService,
    private themeService: ThemeService
  ) { }

  openMenu() {
    this.menuService.setMenuState(!this.menuService.menu.state.value);
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

}
