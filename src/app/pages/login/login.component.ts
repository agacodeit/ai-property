import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorHandlerService } from '../../services/exceptions/error-handler.service';
import { ToastService } from '../../services/toast/toast.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  showPassword: boolean = false;
  loginForm: FormGroup;

  alternativeLogins = [
    {
      alt: 'Continue with Google',
      icon: 'https://auth.openai.com/assets/google-logo-NePEveMl.svg',
      id: 1
    },
    {
      alt: 'Continue with Microsoft',
      icon: 'https://auth.openai.com/assets/microsoft-logo-BUXxQnXH.svg',
      id: 2
    },
    {
      alt: 'Continue with Apple',
      icon: 'https://auth.openai.com/assets/apple-logo-vertically-balanced-rwLdlt8P.svg',
      id: 3
    }
  ]

  loading: boolean = false;
  isSubmitted: boolean = false;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      this.loading = true;
      const result = await this.userService.authenticate(this.loginForm.value);
      if (result.success) {
        this.loading = false;
        this.router.navigate(['/auth/chat']);
      } else if (result.error) {
        this.loading = false;
        this.errorHandlerService.handleError(result.error);
      }
    } else {
      this.toastService.show('Formulário inválido');
    }
  }



}