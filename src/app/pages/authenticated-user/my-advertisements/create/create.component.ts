import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ErrorHandlerService } from '../../../../services/exceptions/error-handler.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { PropertyService } from '../../../../services/property/property.service';
import { Property } from '../../../../shared/models/property/property';
import { ImagesComponent } from "./images/images.component";
import { InfoComponent } from "./info/info.component";
import { ContactComponent } from './contact/contact.component';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-create',
  imports: [
    CommonModule,
    InfoComponent,
    ImagesComponent,
    ContactComponent
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
    },
    {
      label: 'Dados do mediador',
      index: 2
    }
  ];

  activeTab = 0;

  get loggedUser() {
    return this.userService.loggedUser;
  }

  constructor(private modalService: ModalService,
    private userService: UserService,
    private propertyService: PropertyService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.propertyService.listCommodities();
    if (this.modalService.modalRef?.instance?.content?.property) {
      this.property = this.modalService.modalRef.instance.content.property;
    }

    if (this.modalService.modalRef?.instance?.content?.tab) {
      this.activeTab = this.modalService.modalRef?.instance?.content?.tab;
    }
  }

  close() {
    this.modalService.close();
  }

  updateForm(event: { property: Property, tab: number }) {
    this.property = event.property;
    this.activeTab = event.tab;
  }

  async createProperty(property: Property) {
    let response = null;
    property.userId = this.loggedUser!.id;
    if (property.id) await this.propertyService.updateProperty(property);
    else response = await this.propertyService.createProperty(property);
    if (response && response.error) {
      this.errorHandlerService.handleError(response.error);
      return;
    }
    this.modalService.close(true);
  }

}
