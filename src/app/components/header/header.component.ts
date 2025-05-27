import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu/menu.service';
import { ThemeService } from '../../services/theme/theme.service';
import { UserService } from '../../services/user/user.service';
import { OptionsComponent } from '../options/options.component';
import { Option, OptionContainer } from '../../shared/models/components/option';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    OptionsComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  showOptions: boolean = false;

  get loggedUser() {
    return this.userService.loggedUser;
  }

  get options(): OptionContainer {
    return {
      title: this.loggedUser?.name,
      options: [
        {
          id: 1,
          icon: this.darkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon',
          label: this.darkMode ? 'Default mode' : 'Dark mode'
        },
        {
          id: 2,
          icon: 'fa-solid fa-gear',
          label: 'Configurações'
        },
        {
          id: 3,
          icon: 'fa-solid fa-right-from-bracket',
          label: 'Sair',
          color: '#d54343'
        }
      ]
    }
  }

  get menuState() {
    return this.menuService.menu.state.value;
  }

  get darkMode() {
    return this.themeService?.darkMode;
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

  triggerAction(action: number) {
    console.log('cai duas vezes quando clica');

    if (action === 1) {
      this.toggleDarkMode();
    } else if (action === 2) {
    } else if (action === 3) {
      this.logout();
    }
    this.showOptions = false;
  }

}
