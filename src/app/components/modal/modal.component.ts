import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Type,
  Renderer2,
  OnDestroy
} from '@angular/core';
import { menuAnimation } from '../../shared/animations/menu-animations';
import { modalAnimation } from '../../shared/animations/modal-animations';
import { ModalService } from '../../services/modal.service';

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

  constructor(private renderer: Renderer2,
    private modalService: ModalService

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