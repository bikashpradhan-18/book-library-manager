import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MockDbService } from '../../../core/services/mock-db.service';
import { AuthService } from '../../../core/services/auth.service';
import { Book } from '../../../core/models/book.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookDialog } from '../book-dialog/book-dialog';

@Component({
  selector: 'app-books',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class Books {

  books: Book[] = [];

  constructor(
    private db: MockDbService,
    public auth: AuthService,
    private dialog: MatDialog
  ) {
    this.books = this.db.getBooks();
  }

  request(bookId: number) {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.db.requestBook(bookId, user.id);
    this.books = this.db.getBooks(); // refresh
  }

  isRequested(book: Book): boolean {
    const user = this.auth.getCurrentUser();
    return book.requestedBy === user?.id;
  }

  openDialog(book: Book) {
    this.dialog.open(BookDialog, {
      data: book,
      width: '400px'
    });
  }
  
}
