import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralMessagesComponent } from './general-messages.component';

describe('GeneralMessagesComponent', () => {
  let component: GeneralMessagesComponent;
  let fixture: ComponentFixture<GeneralMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
