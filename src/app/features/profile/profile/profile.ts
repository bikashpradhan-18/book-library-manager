import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { MockDbService } from '../../../core/services/mock-db.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  form!: FormGroup;
  changePassword = false;
  currentUser: any;
  hideNewPassword = true;
  hideConfirmPassword = true;
  
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private db: MockDbService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.currentUser = this.auth.getCurrentUser();

    this.form = this.fb.group({
      name: [this.currentUser?.name, Validators.required],
      email: [{ value: this.currentUser?.email, disabled: true }],
      newPassword: [''],
      confirmPassword: ['']
    });
  }

  togglePasswordChange() {
    this.changePassword = !this.changePassword;

    if (this.changePassword) {
      this.form.get('newPassword')?.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);
      this.form.get('confirmPassword')?.setValidators([
        Validators.required
      ]);
    } else {
      this.form.get('newPassword')?.clearValidators();
      this.form.get('confirmPassword')?.clearValidators();
    }

    this.form.get('newPassword')?.updateValueAndValidity();
    this.form.get('confirmPassword')?.updateValueAndValidity();
  }

  onSubmit() {

    if (this.form.invalid) return;

    let updatedPassword = this.currentUser.password;

    if (this.changePassword) {

      const newPass = this.form.value.newPassword;
      const confirmPass = this.form.value.confirmPassword;

      if (newPass !== confirmPass) {
        this.snackBar.open('Passwords do not match', 'Close', {
          duration: 3000
        });
        return;
      }

      updatedPassword = newPass;
    }

    const updatedUser = {
      ...this.currentUser,
      name: this.form.value.name,
      password: updatedPassword
    };

    this.db.updateUser(updatedUser);

    // Logout after profile change
    this.auth.logout();

    this.snackBar.open('Profile updated successfully. Please login again.', 'Close', {
      duration: 3000
    });

    this.router.navigate(['/login']);
  }
}

