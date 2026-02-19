import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-book-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './book-dialog.html',
  styleUrl: './book-dialog.scss',
})
export class BookDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
