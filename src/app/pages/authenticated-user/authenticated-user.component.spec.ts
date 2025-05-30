import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticatedUserComponent } from './authenticated-user.component';

describe('AuthenticatedUserComponent', () => {
  let component: AuthenticatedUserComponent;
  let fixture: ComponentFixture<AuthenticatedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthenticatedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
