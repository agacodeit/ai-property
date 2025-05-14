import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAdvertisementsComponent } from './my-advertisements.component';

describe('MyAdvertisementsComponent', () => {
  let component: MyAdvertisementsComponent;
  let fixture: ComponentFixture<MyAdvertisementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAdvertisementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAdvertisementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
