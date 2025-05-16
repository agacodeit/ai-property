import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu/menu.service';
import { ThemeService } from '../../services/theme/theme.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  get menuState() {
    return this.menuService.menu.state.value;
  }

  get darkMode() {
    return this.themeService.darkMode;
  }

  constructor(private menuService: MenuService,
    private themeService: ThemeService,
    private userService: UserService,
    private router: Router
  ) {

  }

  openMenu() {
    this.menuService.setMenuState(true);
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  toggleMenu() {
    this.menuService.setMenuState(!this.menuState);
  }

}
