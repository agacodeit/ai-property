import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../services/exceptions/error-handler.service';
import { PropertyService } from '../../../services/property/property.service';
import { LoaderComponent } from "../../../components/loader/loader.component";
import { PropertyStatus } from '../../../shared/constants/propertyStatus';
import { Property } from '../../../shared/models/property/property';
import { ModalService } from '../../../services/modal/modal.service';
import { CreateComponent } from './create/create.component';

@Component({
  selector: 'app-my-advertisements',
  imports: [
    CommonModule,
    LoaderComponent
  ],
  templateUrl: './my-advertisements.component.html',
  styleUrl: './my-advertisements.component.scss'
})
export class MyAdvertisementsComponent implements OnInit, OnDestroy {

  loadingProperties: boolean = true;
  propertyStatus = PropertyStatus;

  get propertyList() {
    return this.propertyService.propertyList;
  }

  constructor(private propertyService: PropertyService,
    private errorHandlerService: ErrorHandlerService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.listProperties();
  }

  ngOnDestroy(): void {
    this.propertyService.clearPropertyList();
  }

  async listProperties() {
    const response = await this.propertyService.listProperties();
    if (response.error) {
      this.errorHandlerService.handleError(response.error);
    }
    this.loadingProperties = false;
  }

  editProperty(property: Property) {
    this.modalService.close(null, {
      component: CreateComponent,
      data: {
        title: '',
        icon: '',
        content: property
      }
    })?.subscribe(() => {
      this.modalService.open(MyAdvertisementsComponent, {
        title: 'Meus anúncios',
        icon: 'fa-solid fa-arrow-trend-up',
        fullscreen: true
      })
    });
  }

}
