import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyMaskDirective } from '../../../../../shared/directives/currency-mask.directive';
import { ToastService } from '../../../../../services/toast/toast.service';
import { Property } from '../../../../../shared/models/property/property';

@Component({
  selector: 'app-info',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyMaskDirective
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent implements OnChanges {

  @Input() property: Property = new Property();
  @Output() nextStepEmitter = new EventEmitter();

  infoForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    bedrooms: new FormControl(0, Validators.required),
    bathrooms: new FormControl(0, Validators.required),
    hasPool: new FormControl(false, Validators.required),
    hasGourmetBalcony: new FormControl(false, Validators.required)
  });

  constructor(private toastService: ToastService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'].currentValue) {
      Object.keys(this.property).forEach(key => {
        const typedKey = key as keyof Property;
        const control = this.infoForm.controls[typedKey];
        if (control) control.setValue(this.property[typedKey]);
      });
    }
  }

  submit() {
    if (this.infoForm.valid) {
      this.nextStepEmitter.next({ property: this.infoForm.value, tab: 1 });
    } else this.toastService.show('Formulário inválido', 'error');
  }

}
