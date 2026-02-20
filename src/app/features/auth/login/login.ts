import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  form!: FormGroup;
  errorMessage = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private seo: Seo
  ) {
    this.seo.updateSeo({
      title: 'Login | Book Library Manager',
      description: 'Login to manage books and users in the Book Library Manager.'
    });
    
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: (res) => {
        this.auth.setSession(res.token);
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Invalid email or password';
      },
    });
  }

  goToBooks() {
    this.router.navigate(['/books']);
  }

}
