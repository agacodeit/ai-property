import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { ImageItem } from '../../shared/models/image-preview/imageItem';
import { Subscription } from 'rxjs';
import { ImageGalleryService } from '../../services/image-gallery/image-gallery.service';

@Component({
  selector: 'app-image-gallery-preview',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './image-gallery-preview.component.html',
  styleUrls: ['./image-gallery-preview.component.scss']
})
export class ImageGalleryPreviewComponent {
  images: ImageItem[] = [];
  currentIndex: number = 0;
  show: boolean = false;

  private subscriptions = new Subscription();

  private escListener: () => void;

  constructor(private galleryService: ImageGalleryService,
    private renderer: Renderer2
  ) {
    this.subscriptions.add(
      this.galleryService.images$.subscribe(images => (this.images = images))
    );
    this.subscriptions.add(
      this.galleryService.currentIndex$.subscribe(index => (this.currentIndex = index))
    );
    this.subscriptions.add(
      this.galleryService.isOpen$.subscribe(open => (this.show = open))
    );
    this.escListener = this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }

  next() {
    this.galleryService.next();
  }

  prev() {
    this.galleryService.prev();
  }

  close() {
    this.galleryService.close();
  }

  get currentImage(): ImageItem | null {
    return this.images.length > 0 ? this.images[this.currentIndex] : null;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  download() {
    window.open(this.images[this.currentIndex].url), '_blank';
  }
}
