import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../../services/modal/modal.service';
import { Property } from '../../../../shared/models/property/property';
import { ImagesComponent } from "./images/images.component";
import { InfoComponent } from "./info/info.component";
import { PropertyService } from '../../../../services/property/property.service';
import { ErrorHandlerService } from '../../../../services/exceptions/error-handler.service';

@Component({
  selector: 'app-create',
  imports: [
    CommonModule,
    InfoComponent,
    ImagesComponent
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  property: Property = new Property();

  tabs = [
    {
      label: 'Dados do imóvel',
      index: 0
    },
    {
      label: 'Imagens',
      index: 1
    }
  ];

  activeTab = 0;

  constructor(private modalService: ModalService,
    private propertyService: PropertyService,
    private errorHandlerService: ErrorHandlerService
  ) {
    if (this.modalService.modalRef?.instance?.content?.property) {
      this.property = this.modalService.modalRef.instance.content.property;
    }
  }

  close() {
    this.modalService.close({ value: 'fechou com esse valor' })
  }

  updateForm(event: { property: Property, tab: number }) {
    this.property = event.property;
    this.activeTab = event.tab;
  }

  async createProperty(property: Property) {
    let response = null;
    if (property.id) await this.propertyService.updateProperty(property);
    else response = await this.propertyService.createProperty(property);
    if (response && response.error) {
      this.errorHandlerService.handleError(response.error);
      return;
    }
    this.modalService.close(true);
  }

}
