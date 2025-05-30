import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageItem } from '../../shared/models/image-preview/imageItem';

@Injectable({
  providedIn: 'root'
})
export class ImageGalleryService {
  private imagesSubject = new BehaviorSubject<ImageItem[]>([]);
  private currentIndexSubject = new BehaviorSubject<number>(0);
  private isOpenSubject = new BehaviorSubject<boolean>(false);

  images$ = this.imagesSubject.asObservable();
  currentIndex$ = this.currentIndexSubject.asObservable();
  isOpen$ = this.isOpenSubject.asObservable();

  /**
   * Abre a galeria com as imagens passadas e define o índice inicial
   */
  open(images: ImageItem[], startIndex: number = 0) {
    this.imagesSubject.next(images);
    this.currentIndexSubject.next(startIndex);
    this.isOpenSubject.next(true);
  }

  /**
   * Fecha a galeria
   */
  close() {
    this.isOpenSubject.next(false);
  }

  /**
   * Próxima imagem
   */
  next() {
    const images = this.imagesSubject.value;
    const currentIndex = this.currentIndexSubject.value;
    if (images.length > 0) {
      const nextIndex = (currentIndex + 1) % images.length;
      this.currentIndexSubject.next(nextIndex);
    }
  }

  /**
   * Imagem anterior
   */
  prev() {
    const images = this.imagesSubject.value;
    const currentIndex = this.currentIndexSubject.value;
    if (images.length > 0) {
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      this.currentIndexSubject.next(prevIndex);
    }
  }
}