import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Property } from '../../../../../shared/models/property/property';
import { ToastService } from '../../../../../services/toast/toast.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../../../../services/property/property.service';
import { LoaderComponent } from '../../../../../components/loader/loader.component';
import { isInvalid } from '../../../../../shared/utils/validators';

@Component({
  selector: 'app-mediator',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent
  ],
  templateUrl: './mediator.component.html',
  styleUrl: './mediator.component.scss'
})
export class MediatorComponent implements OnChanges {

  @Input() property: Property = new Property();
  @Output() previousEmitter = new EventEmitter();
  @Output() publishEmitter = new EventEmitter();

  publishing: boolean = false;
  formSubmitted: boolean = false;

  mediatorForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    title: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl(null),
    bedrooms: new FormControl(null),
    bathrooms: new FormControl(null),
    hasPool: new FormControl(false),
    hasGourmetBalcony: new FormControl(false),
    imageUrls: new FormControl([]),
    propertyTypeEnum: new FormControl(''),
    advertisementTypeEnum: new FormControl(''),
    propertyAddress: new FormGroup({
      street: new FormControl(''),
      number: new FormControl(''),
      zipCode: new FormControl(''),
      city: new FormControl(''),
      district: new FormControl(''),
      parish: new FormControl(''),
      country: new FormControl(''),
      complement: new FormControl(''),
      neighborhood: new FormControl('')
    }),
    mediator: new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      link: new FormControl('', Validators.required)
    }),
    commodities: new FormArray([])
  });

  constructor(private toastService: ToastService,
    private propertyService: PropertyService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property']?.currentValue) {
      this.propertyService.patchFormValues(this.mediatorForm, this.property);
    }
  }

  previous() {
    this.previousEmitter.next({ property: this.mediatorForm.value, tab: 1 });
  }

  publish() {
    this.formSubmitted = true;
    if (this.mediatorForm.valid) {
      this.publishing = true;
      this.property = this.mediatorForm.value;
      this.publishEmitter.next(this.property);
      return;
    } else this.toastService.show('Formulário inválido', 'error');

    this.publishing = false;
  }

  isInvalid(formControl: any): any {
    if (!this.formSubmitted) return false;
    return isInvalid(formControl);
  }

}
