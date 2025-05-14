import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Type
} from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalRef?: ComponentRef<ModalComponent>;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) { }

  open(
    component: Type<any>,
    options: { fullscreen?: boolean; icon: string; title: string }
  ): void {
    if (this.modalRef) return;

    const factory = this.resolver.resolveComponentFactory(ModalComponent);
    this.modalRef = factory.create(this.injector);

    this.modalRef.instance.fullscreen = !!options.fullscreen;
    this.modalRef.instance.title = options.title;
    this.modalRef.instance.icon = options.icon;

    this.modalRef.instance.close.subscribe(() => this.close());

    this.appRef.attachView(this.modalRef.hostView);
    document.body.appendChild(this.modalRef.location.nativeElement);

    this.modalRef.instance.loadChildComponent(component);
  }

  close(): void {
    if (!this.modalRef) return;
    this.appRef.detachView(this.modalRef.hostView);
    this.modalRef.destroy();
    this.modalRef = undefined;
  }
}