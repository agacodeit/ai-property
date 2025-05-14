import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { modalAnimation } from '../../shared/animations/modal-animations';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [modalAnimation]
})
export class ModalComponent implements OnDestroy {
  @Input() title!: string;
  @Input() icon!: string;
  @Input() fullscreen = false;
  @Output() close = new EventEmitter<void>();
  private escListener: () => void;

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  constructor(private renderer: Renderer2

  ) {
    // Escutador de tecla "Esc"
    this.escListener = this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.onClose();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.escListener) {
      this.escListener();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  loadChildComponent(component: Type<any>) {
    this.container.clear();
    this.container.createComponent(component);
  }
}