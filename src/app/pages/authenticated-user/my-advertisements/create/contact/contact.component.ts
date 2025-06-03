import { Component, DebugElement, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Property } from '../../../../../shared/models/property/property';
import { ToastService } from '../../../../../services/toast/toast.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../../../../services/property/property.service';
import { LoaderComponent } from '../../../../../components/loader/loader.component';
import { isInvalid, scrollToInvalidField } from '../../../../../shared/utils/validators';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnChanges {

  @Input() property: Property = new Property();
  @Output() previousEmitter = new EventEmitter();
  @Output() publishEmitter = new EventEmitter();

  publishing: boolean = false;
  formSubmitted: boolean = false;
  infoText: string = `
  <div class="info-box">
      <i class="fa-solid fa-circle-info"></i>
      <strong>Atenção:</strong>
      <br/><br/>
      <p>
          Seu anúncio só será publicado após preencher <strong>nome</strong>, <strong>telefone</strong> e <strong>e-mail</strong> do responsável.
Enquanto isso, ele ficará como rascunho e não aparecerá nas buscas.
      </p>
  </div>
`;

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
    propertyStatusEnum: new FormControl(''),
    advertisementTypeEnum: new FormControl(''),
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
      contactType: new FormControl('BROKER', Validators.required),
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      link: new FormControl('')
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
    this.mediatorForm.markAllAsTouched();

    if (this.mediatorForm.get('mediator')!.get('contactType')!.value !== 'AGENCY') {
      this.mediatorForm.get('mediator')!.get('link')!.disable();
    } else this.mediatorForm.get('mediator')!.get('link')!.enable();

    if (this.mediatorForm.valid) {
      this.publishing = true;
      this.property = this.mediatorForm.value;
      this.publishEmitter.next(this.property);
      return;
    } else {
      scrollToInvalidField(this.mediatorForm);
      this.toastService.show('Formulário inválido', 'error')
    };

    this.publishing = false;
  }

  isInvalid(formControl: any): any {
    if (!this.formSubmitted) return false;
    return isInvalid(formControl);
  }

}
