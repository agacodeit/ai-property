import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../../../../../services/property/property.service';
import { ToastService } from '../../../../../services/toast/toast.service';
import { AdvertisementTypeEnum } from '../../../../../shared/constants/advertisementTypeEnum';
import { PropertyTypeEnum } from '../../../../../shared/constants/propertyTypeEnum';
import { CurrencyMaskDirective } from '../../../../../shared/directives/currency-mask.directive';
import { InputMaskDirective } from '../../../../../shared/directives/input-mask.directive';
import { Property } from '../../../../../shared/models/property/property';
import { PropertyCommodity } from '../../../../../shared/models/property/propertyCommodity';
import { isInvalid, scrollToInvalidField } from '../../../../../shared/utils/validators';

@Component({
  selector: 'app-info',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyMaskDirective,
    InputMaskDirective
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent implements OnChanges {

  @Input() property: Property = new Property();
  @Output() nextStepEmitter = new EventEmitter();

  formSubmited: boolean = false;

  infoForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(null, Validators.required),
    bedrooms: new FormControl(null),
    bathrooms: new FormControl(null),
    hasPool: new FormControl(false),
    hasGourmetBalcony: new FormControl(false),
    imageUrls: new FormControl([]),
    propertyTypeEnum: new FormControl('', Validators.required),
    propertyStatusEnum: new FormControl(''),
    advertisementTypeEnum: new FormControl('', Validators.required),
    propertyAddress: new FormGroup({
      street: new FormControl(''),
      number: new FormControl(''),
      zipCode: new FormControl(''),
      city: new FormControl(''),
      district: new FormControl(''),
      parish: new FormControl(''),
      country: new FormControl('')
    }),
    mediator: new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      link: new FormControl(''),
    }),
    commodities: new FormArray([])
  });

  get commodities(): FormArray {
    return this.infoForm.get('commodities') as FormArray;
  }

  get commodityList() {
    return this.propertyService.commodityList;
  }

  constructor(private toastService: ToastService,
    private propertyService: PropertyService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property']?.currentValue) {
      this.propertyService.patchFormValues(this.infoForm, this.property);
    }
  }

  submit() {
    this.formSubmited = true;
    this.infoForm.markAllAsTouched();
    if (this.infoForm.valid) {
      this.nextStepEmitter.next({ property: this.infoForm.value, tab: 1 });
    } else {
      scrollToInvalidField(this.infoForm);
      this.toastService.show('Formulário inválido', 'error');
    };
  }

  setAdvertisementType(advertisementTypeEnum: string) {
    this.infoForm.get('advertisementTypeEnum')?.setValue(advertisementTypeEnum as AdvertisementTypeEnum);
  }

  setPropertyType(propertyTypeEnum: string) {
    this.infoForm.get('propertyTypeEnum')?.setValue(propertyTypeEnum as PropertyTypeEnum);
  }


  isCommodityIncluded(commodity: PropertyCommodity): boolean {
    return this.commodities.controls.some(control => control.value?.id === commodity.id);
  }

  updateCommodities(commodity: PropertyCommodity): void {
    const index = this.commodities.controls.findIndex(control => control.value?.id === commodity.id);

    if (index === -1) {
      this.commodities.push(new FormControl(commodity));
    } else {
      this.commodities.removeAt(index);
    }
  }

  isInvalid(formControl: any): any {
    if (!this.formSubmited) return false;
    return isInvalid(formControl);
  }

  preventInvalidNumber(event: any) {
    const input = event.target;
    let value = input.value;

    value = value.replace(/[^0-9]/g, '');

    value = value.replace(/^0+(?!$)/, '');

    let number = value ? parseInt(value, 10) : 0;

    if (number < 0) number = 0;
    if (number > 99) number = 99;

    input.value = number;

    const control = this.infoForm.get(input.getAttribute('formControlName'));
    if (control) {
      control.setValue(number);
    }
  }


}
