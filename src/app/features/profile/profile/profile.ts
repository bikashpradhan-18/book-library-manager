import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { MockDbService } from '../../../core/services/mock-db.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  form!: FormGroup;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private db: MockDbService
  ) {
    const user = this.auth.getCurrentUser();
    
    this.form = this.fb.group({
      name: [user?.name, Validators.required],
      email: [{ value: user?.email, disabled: true }],
      password: [user?.password, [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit() {
    // if (this.form.invalid) return;

    // const currentUser = this.auth.getCurrentUser();
    // if (!currentUser) return;

    // const updatedUser = {
    //   ...currentUser,
    //   name: this.form.value.name,
    //   password: this.form.value.password || currentUser.password,
    // };

    // this.db.updateUser(updatedUser);

    // // Update session state
    // this.auth.setSession(
    //   localStorage.getItem('token')!,
    //   updatedUser
    // );

    // this.successMessage = 'Profile updated successfully';
  }

}
