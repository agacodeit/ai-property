import { Component, Input } from '@angular/core';
import { Property } from '../../../../../shared/models/property/property';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-images',
  imports: [
    CommonModule
  ],
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss'
})
export class ImagesComponent {
  @Input() property: Property = new Property();

}
