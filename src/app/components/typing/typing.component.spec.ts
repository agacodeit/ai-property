import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingComponent } from './typing.component';

describe('TypingComponent', () => {
  let component: TypingComponent;
  let fixture: ComponentFixture<TypingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
