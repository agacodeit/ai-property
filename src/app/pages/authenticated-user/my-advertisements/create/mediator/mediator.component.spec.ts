import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediatorComponent } from './mediator.component';

describe('MediatorComponent', () => {
  let component: MediatorComponent;
  let fixture: ComponentFixture<MediatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
