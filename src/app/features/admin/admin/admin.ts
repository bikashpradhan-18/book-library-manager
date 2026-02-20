import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MockDbService } from '../../../core/services/mock-db.service';
@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {

  displayedColumns = ['name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private db: MockDbService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.dataSource.data = this.db.getUsers();
  }

  // 🔍 Search
  applySearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  // 🎭 Role Filter
  filterByRole(role: string) {
    if (!role) {
      this.loadUsers();
      return;
    }

    this.dataSource.data = this.db.getUsers()
      .filter(user => user.role === role);
  }

  // ➕ Navigate Add
  addUser() {
    this.router.navigate(['/admin/add']);
  }

  // ✏ Navigate Edit
  editUser(id: number) {
    this.router.navigate(['/admin/edit', id]);
  }

  // 🗑 Delete
  deleteUser(id: number) {
    this.db.deleteUser(id);
    this.snackBar.open('User deleted successfully', 'Close', {
      duration: 2000
    });
    this.loadUsers();
  }
}
