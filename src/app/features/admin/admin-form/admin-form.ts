import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MockDbService } from '../../../core/services/mock-db.service';

@Component({
  selector: 'app-admin-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './admin-form.html',
  styleUrl: './admin-form.scss',
})
export class AdminForm {

  form!: FormGroup;
  isEditMode = false;
  changePassword = false;
  currentUser: any;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private db: MockDbService,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
    this.checkEditMode();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      const user = this.db.getUsers().find(u => u.id === +id);

      if (!user) {
        this.router.navigate(['/admin']);
        return;
      }

      this.currentUser = user;

      this.form.patchValue({
        name: user.name,
        email: user.email,
        role: user.role,
      });

      this.form.get('email')?.disable();

      // Remove password validators initially
      this.form.get('password')?.clearValidators();
      this.form.get('confirmPassword')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      this.form.get('confirmPassword')?.updateValueAndValidity();
    }
  }

  togglePasswordChange() {
    this.changePassword = !this.changePassword;

    if (this.changePassword) {
      this.form.get('password')?.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);
      this.form.get('confirmPassword')?.setValidators([
        Validators.required
      ]);
    } else {
      this.form.get('password')?.clearValidators();
      this.form.get('confirmPassword')?.clearValidators();
    }

    this.form.get('password')?.updateValueAndValidity();
    this.form.get('confirmPassword')?.updateValueAndValidity();
  }

  onSubmit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let finalPassword = this.form.value.password;

    if (this.isEditMode) {

      if (this.changePassword) {
        if (this.form.value.password !== this.form.value.confirmPassword) {
          this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
          return;
        }
      } else {
        finalPassword = this.currentUser.password;
      }

      const updatedUser = {
        ...this.currentUser,
        name: this.form.value.name,
        role: this.form.value.role,
        password: finalPassword
      };

      this.db.updateUser(updatedUser);
      this.snackBar.open('User updated successfully', 'Close', { duration: 2000 });

    } else {

      if (this.form.value.password !== this.form.value.confirmPassword) {
        this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
        return;
      }

      const newUser = {
        name: this.form.value.name,
        email: this.form.value.email,
        role: this.form.value.role,
        password: finalPassword
      };

      this.db.addUser(newUser);
      this.snackBar.open('User added successfully', 'Close', { duration: 2000 });
    }

    this.router.navigate(['/admin']);
  }
}
