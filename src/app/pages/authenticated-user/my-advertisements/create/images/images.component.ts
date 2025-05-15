import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Property, PropertyImage } from '../../../../../shared/models/property/property';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../../../services/upload/upload.service';
import { ChangeDetectorRef } from '@angular/core';

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
  @Output() previousEmitter = new EventEmitter();
  @Output() publishEmitter = new EventEmitter();

  imageUrls: Array<PropertyImage> = [];

  constructor(private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) {

  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);

    (async () => {
      for (const file of files) {
        const upload = (await this.uploadService.uploadFile(file)).content;

        const propertyImage: any = {
          fileCode: upload.code,
          fileName: file.name,
          file
        }

        this.imageUrls.push(propertyImage);
        this.cdr.detectChanges();
      }
    })();
  }

  previous() {
    this.previousEmitter.next({ property: this.property, tab: 0 });
  }

  publish() {
    this.property.imageUrls = this.imageUrls.map(i => {
      delete i.file;
      return i
    });
    this.publishEmitter.next(this.property);
  }

  getImageUrl(file: any): string {
    return URL.createObjectURL(file);
  }

  removeImage(image: PropertyImage) {
    const found = this.imageUrls.findIndex(i => i.fileCode === image.fileCode);
    if (found >= 0) this.imageUrls.splice(found, 1);
  }
}
