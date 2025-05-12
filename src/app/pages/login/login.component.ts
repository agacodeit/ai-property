import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

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

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      if (await this.userService.authenticate(this.loginForm.value)) this.router.navigate(['/auth/chat/123']);
      else alert('Erro');
    }
  }



}