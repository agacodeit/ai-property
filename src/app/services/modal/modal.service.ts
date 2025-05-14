import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Type
} from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalOptions } from '../../shared/models/modal/modalOptions';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalRef?: ComponentRef<ModalComponent>;
  private onCloseSubject?: Subject<void>;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) { }

  open(component: Type<any>, options: ModalOptions): Observable<any> {
    if (this.modalRef) return new Observable<any>(); // evita múltiplos modais

    this.onCloseSubject = new Subject<any>();

    const factory = this.resolver.resolveComponentFactory(ModalComponent);
    this.modalRef = factory.create(this.injector);

    this.modalRef.instance.fullscreen = !!options.fullscreen;
    this.modalRef.instance.title = options.title;
    this.modalRef.instance.icon = options.icon;

    this.modalRef.instance.close.subscribe(() => this.close());

    this.appRef.attachView(this.modalRef.hostView);
    document.body.appendChild(this.modalRef.location.nativeElement);

    this.modalRef.instance.loadChildComponent(component);

    return this.onCloseSubject.asObservable(); // retorna observable para o chamador
  }

  close(onClose?: any, openNext?: { component: Type<any>, data: ModalOptions }): Observable<any> | void {
    if (!this.modalRef) return;

    this.appRef.detachView(this.modalRef.hostView);
    this.modalRef.destroy();
    this.modalRef = undefined;

    if (this.onCloseSubject) {
      this.onCloseSubject.next(onClose);
      this.onCloseSubject.complete();
      this.onCloseSubject = undefined;
    }

    if (openNext) {
      return new Observable<any>((subscriber) => {
        setTimeout(() => {
          this.open(openNext.component, openNext.data).subscribe((res) => {
            subscriber.next(res);
            subscriber.complete();
          });
        }, 100);
      });
    }
  }
}