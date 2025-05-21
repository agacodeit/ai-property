import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../services/exceptions/error-handler.service';
import { PropertyService } from '../../../services/property/property.service';
import { LoaderComponent } from "../../../components/loader/loader.component";
import { PropertyStatus } from '../../../shared/constants/propertyStatus';
import { Property } from '../../../shared/models/property/property';
import { ModalService } from '../../../services/modal/modal.service';
import { CreateComponent } from './create/create.component';
import { GeneralMessagesComponent } from '../../../components/general-messages/general-messages.component';
import { fadeAnimation } from '../../../shared/animations/fade-animation';
import { PropertyType } from '../../../shared/constants/propertyTypeEnum';
import { AdvertisementType } from '../../../shared/constants/advertisementTypeEnum';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-my-advertisements',
  imports: [
    CommonModule,
    LoaderComponent
  ],
  templateUrl: './my-advertisements.component.html',
  styleUrl: './my-advertisements.component.scss',
  animations: [fadeAnimation]
})
export class MyAdvertisementsComponent implements OnInit, OnDestroy {

  loadingProperties: boolean = true;
  propertyStatus = PropertyStatus;
  propertyType = PropertyType;
  advertisementType = AdvertisementType;

  get propertyList() {
    return this.propertyService.propertyList;
  }

  constructor(private propertyService: PropertyService,
    private errorHandlerService: ErrorHandlerService,
    private modalService: ModalService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.listProperties();
  }

  ngOnDestroy(): void {
    this.propertyService.clearPropertyList();
  }

  createProperty() {
    this.modalService.close(null, {
      component: CreateComponent,
      data: {
        title: 'Criar anúncio',
        icon: 'fa-solid fa-arrow-trend-up'
      }
    })?.subscribe((confirm: boolean) => {
      if (confirm) this.toastService.show('Anúncio criado com sucesso', 'success');
      this.modalService.open(MyAdvertisementsComponent, {
        title: 'Meus anúncios',
        icon: 'fa-solid fa-arrow-trend-up',
        fullscreen: true
      })
    });
  }

  async listProperties() {
    const response = await this.propertyService.listProperties();
    if (response.error) {
      this.errorHandlerService.handleError(response.error);
    }
    this.loadingProperties = false;
  }

  editProperty(property: Property, toImages?: boolean) {
    this.modalService.close(null, {
      component: CreateComponent,
      data: {
        title: 'Editar anúncio',
        icon: 'fa-solid fa-arrow-trend-up',
        content: { property, tab: toImages ? 1 : null }
      }
    })?.subscribe((confirm: boolean) => {
      if (confirm) this.toastService.show('Anúncio editado com sucesso', 'success');
      this.modalService.open(MyAdvertisementsComponent, {
        title: 'Meus anúncios',
        icon: 'fa-solid fa-arrow-trend-up',
        fullscreen: true
      })
    });
  }

  deleteProperty(propertyId: string) {
    this.modalService.close(null, {
      component: GeneralMessagesComponent,
      data: {
        title: 'Remover anúncio',
        icon: 'fa-solid fa-arrow-trend-up',
        content: {
          propertyId,
          message: 'Deseja realmente remover este anúncio?',
          btns: [
            {
              class: 'secondary-btn',
              label: 'Cancelar',
              value: false
            },
            {
              class: 'primary-btn',
              label: 'Confirmar',
              value: true
            }
          ]
        }
      }
    })?.subscribe(async (confirm: boolean) => {
      if (confirm) {
        const response = await this.propertyService.deleteProperty(propertyId);
        if (response.error) this.errorHandlerService.handleError(response.error);
        else {
          this.toastService.show('Anúncio removido com sucesso!', 'success');
        }
      }

      this.modalService.open(MyAdvertisementsComponent, {
        title: 'Meus anúncios',
        icon: 'fa-solid fa-arrow-trend-up',
        fullscreen: true
      })

    });
  }

}
