import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { ThemeService } from '../../services/theme.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

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

}
