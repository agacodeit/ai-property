import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ThemeService } from './services/theme/theme.service';
import { ToastService } from './services/toast/toast.service';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ai-property';
  @ViewChild(ToastComponent) toastComp!: ToastComponent;


  constructor(private themeService: ThemeService,
    private toastService: ToastService
  ) {
    this.themeService.loadTheme();
  }

  ngAfterViewInit() {
    this.toastService.register(this.toastComp);
  }

}
