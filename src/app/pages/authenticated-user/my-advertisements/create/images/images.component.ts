import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Property, PropertyImage } from '../../../../../shared/models/property/property';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../../../services/upload/upload.service';
import { ChangeDetectorRef } from '@angular/core';
import { ToastService } from '../../../../../services/toast/toast.service';
import { LoaderComponent } from '../../../../../components/loader/loader.component';

@Component({
  selector: 'app-images',
  imports: [
    CommonModule,
    LoaderComponent
  ],
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss'
})
export class ImagesComponent {

  @Input() property: Property = new Property();
  @Output() previousEmitter = new EventEmitter();
  @Output() nextStepEmitter = new EventEmitter();

  imageUrls: Array<PropertyImage> = [];
  loadingImages: boolean = false;

  constructor(private uploadService: UploadService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'].currentValue) {
      this.imageUrls = this.property.imageUrls;
      Object.keys(this.property).forEach(key => {
        const typedKey = key as keyof Property;
        if (typedKey === 'imageUrls') {
          this.imageUrls = this.property[typedKey].map((img: PropertyImage) => {
            img.loaded = false;
            return img;
          });
        }
      });
    }
  }

  async onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);

    this.loadingImages = true;

    const uploadPromises = files.map(async (file) => {
      const upload = (await this.uploadService.uploadFile(file)).content;

      return {
        fileCode: upload.code,
        fileName: file.name,
        file,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    this.imageUrls.push(...uploadedImages);

    this.cdr.detectChanges();
    this.loadingImages = false;
  }


  previous() {
    this.previousEmitter.next({ property: this.property, tab: 0 });
  }

  submit() {
    this.property.imageUrls = this.imageUrls;
    this.nextStepEmitter.next({ property: this.property, tab: 2 });
  }

  getImageUrl(file: any): string {
    return URL.createObjectURL(file);
  }

  removeImage(image: PropertyImage) {
    const found = this.imageUrls.findIndex(i => i.fileCode === image.fileCode);
    if (found >= 0) this.imageUrls.splice(found, 1);
  }
}
