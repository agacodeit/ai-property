import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MenuService } from '../../services/menu/menu.service';
import { ThemeService } from '../../services/theme/theme.service';
import { MenuComponent } from '../../components/menu/menu.component';
import { menuAnimation } from '../../shared/animations/menu-animations';
import { ImageGalleryPreviewComponent } from '../../components/image-gallery-preview/image-gallery-preview.component';
import { ImageGalleryService } from '../../services/image-gallery/image-gallery.service';

@Component({
  selector: 'app-authenticated-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    MenuComponent,
    ImageGalleryPreviewComponent
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

  get imageGalleryPreview() {
    return this.imageGalleryService.images$;
  }

  get imagePreviewIndex() {
    return this.imageGalleryService.currentIndex$;
  }

  get showImageGalleryPreview() {
    return this.imageGalleryService.isOpen$;
  }

  constructor(private menuService: MenuService,
    private themeService: ThemeService,
    private imageGalleryService: ImageGalleryService
  ) { }

  openMenu() {
    this.menuService.setMenuState(!this.menuService.menu.state.value);
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

}
