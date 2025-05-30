import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGalleryPreviewComponent } from './image-gallery-preview.component';

describe('ImageGalleryPreviewComponent', () => {
  let component: ImageGalleryPreviewComponent;
  let fixture: ComponentFixture<ImageGalleryPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGalleryPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageGalleryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
