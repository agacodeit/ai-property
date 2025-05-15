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
  private modalRefData?: ComponentRef<ModalComponent>;
  private onCloseSubject?: Subject<void>;

  get modalRef() {
    return this.modalRefData;
  }

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) { }

  open(component: Type<any>, options: ModalOptions): Observable<any> {
    if (this.modalRefData) return new Observable<any>();

    this.onCloseSubject = new Subject<any>();

    const factory = this.resolver.resolveComponentFactory(ModalComponent);
    this.modalRefData = factory.create(this.injector);

    this.modalRefData.instance.fullscreen = !!options.fullscreen;
    this.modalRefData.instance.title = options.title;
    this.modalRefData.instance.icon = options.icon;
    this.modalRefData.instance.content = options.content;

    this.modalRefData.instance.close.subscribe(() => this.close());

    this.appRef.attachView(this.modalRefData.hostView);
    document.body.appendChild(this.modalRefData.location.nativeElement);

    this.modalRefData.instance.loadChildComponent(component);

    return this.onCloseSubject.asObservable();
  }

  close(onClose?: any, openNext?: { component: Type<any>, data: ModalOptions }): Observable<any> | void {
    if (!this.modalRefData) return;

    this.appRef.detachView(this.modalRefData.hostView);
    this.modalRefData.destroy();
    this.modalRefData = undefined;

    if (this.onCloseSubject) {
      this.onCloseSubject.next(onClose);
      this.onCloseSubject.complete();
      this.onCloseSubject = undefined;
    }

    if (openNext) {
      return new Observable<any>((subscriber) => {
        this.open(openNext.component, openNext.data).subscribe((res) => {
          subscriber.next(res);
          subscriber.complete();
        });
      });
    }
  }
}