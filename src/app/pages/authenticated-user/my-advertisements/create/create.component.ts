import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../../services/modal/modal.service';
import { Property } from '../../../../shared/models/property/property';
import { ImagesComponent } from "./images/images.component";
import { InfoComponent } from "./info/info.component";

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

  constructor(private modalService: ModalService) {
    if (this.modalService.modalRef?.instance?.content?.property) {
      this.property = this.modalService.modalRef.instance.content.property;
    }
  }

  close() {
    this.modalService.close({ value: 'fechou com esse valor' })
  }

  updateForm(event: { property: Property, tab: number }) {
    this.property = event.property;
    console.log(this.property);
    this.activeTab = event.tab;
  }



}
